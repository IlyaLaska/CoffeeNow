import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import sharp from 'sharp';
import { In, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { ListResultDto } from '../../common/dto/list-result.dto';
import { ConfigService } from '../../common/modules/config/config.service';
import { S3Service } from '../../common/modules/s3/s3.service';
import { ScaleService } from '../scale/scale.service';
import { Image } from './entities/image.entity';
import { ImageMetadata } from './types/ImageMetadata';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
    private readonly scaleService: ScaleService,
  ) {}

  async uploadAndSave(filename: string, fileStream: NodeJS.ReadableStream, mimetype?: string): Promise<Image> {
    const id = uuid();
    const fileExtension = filename.split('.').pop();
    const fileNameOriginal = `${this.configService.s3ImagesFolder}/${id}.${fileExtension}`;
    const scales = [1024, 512, 256];
    //await this.scaleService.getScales();

    const metadata = await this.uploadImage(id, scales, fileNameOriginal, filename, fileStream, mimetype);

    return this.imageRepository.save({
      id,
      bucket: metadata.bucket,
      location: metadata.location,
      key: metadata.key,
      originalName: filename,
      scales: scales.map((item) => item + ''),
    });
  }

  async uploadAndSaveAsync(filename: string, fileStream: NodeJS.ReadableStream, mimetype?: string): Promise<Image> {
    const id = uuid();
    const fileExtension = filename.split('.').pop();
    const fileNameOriginal = `${this.configService.s3ImagesFolder}/${id}.${fileExtension}`;
    const scales = await this.scaleService.getScales();

    const image = this.imageRepository.save({
      id,
      originalName: filename,
      bucket: this.configService.s3Bucket,
      location: `${this.configService.s3Endpoint}/${fileNameOriginal}`,
      key: fileNameOriginal,
      scales: scales.map((item) => item + ''),
    });

    this.finishUploading(id, scales, fileNameOriginal, filename, fileStream, mimetype);
    return image;
  }

  async finishUploading(
    id: string,
    scales: number[],
    fileNameOriginal: string,
    filename: string,
    fileStream: NodeJS.ReadableStream,
    mimetype?: string,
  ): Promise<void> {
    const metadata = await this.uploadImage(id, scales, fileNameOriginal, filename, fileStream, mimetype);
    await this.imageRepository.save({
      id,
      location: metadata.location,
    });
  }

  async uploadImage(
    id: string,
    scales: number[],
    fileNameOriginal: string,
    filename: string,
    fileStream: NodeJS.ReadableStream,
    mimetype?: string,
  ): Promise<ImageMetadata> {
    const sharpStream = sharp();
    const promises: Promise<ManagedUpload.SendData>[] = [];
    promises.push(this.s3Service.uploadStream(fileNameOriginal, sharpStream.clone(), mimetype));
    for (const scale of scales) {
      const fileNameX = `${this.configService.s3ImagesFolder}/${id}_${scale}.jpg`;
      promises.push(
        this.s3Service.uploadStream(
          fileNameX,
          sharpStream
            .clone()
            .resize(scale, scale, { fit: 'inside', withoutEnlargement: true })
            .flatten({ background: { r: 255, g: 255, b: 255 } })
            .jpeg({ force: true, progressive: true, quality: scale > 256 ? 90 : 100 }),
          'image/jpeg',
        ),
      );
    }
    fileStream.pipe(sharpStream);

    const [fileUploaded] = await Promise.all(promises);
    return { bucket: fileUploaded.Bucket, key: fileUploaded.Key, location: fileUploaded.Location };
  }

  async uploadScale(key: string, scale: number): Promise<string> {
    const keyArr = key.split('.');
    keyArr.pop();
    const fileName = keyArr.join('.');
    const newKey = `${fileName}_${scale}.jpg`;
    const sharpStream = sharp()
      .resize(scale, scale, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ force: true, progressive: true, quality: scale > 256 ? 90 : 100 });
    const fileStream = this.s3Service.downloadFileStream(key);
    const promise = this.s3Service.uploadStream(newKey, sharpStream, 'image/jpeg');
    fileStream.pipe(sharpStream);
    await promise;
    return newKey;
  }
  async updateScale(id: string, scales: string[], userId: string): Promise<Image> {
    return this.imageRepository.save({
      id,
      scales,
      lastUpdatedBy: userId,
    });
  }

  async findAll(query: FindAllQueryDto): Promise<ListResultDto<Image>> {
    const [result, totalCount] = await this.imageRepository.findAndCount({ ...query.toSQL() });
    return { result, totalCount };
  }

  async findOneOnly(id: string): Promise<Image> {
    const image = await this.imageRepository.findOne(id);
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return image;
  }

  async findByIds(ids: string[]): Promise<Image[]> {
    return await this.imageRepository.find({ where: { id: In(ids) } });
  }

  async findByIdsAndSort(ids: string[]): Promise<Image[]> {
    let images = await this.imageRepository.find({ where: { id: In(ids) } });
    images = images.sort((a, b) => ids.findIndex((id) => a.id === id) - ids.findIndex((id) => b.id === id));
    return images;
  }

  async getByName(name: string): Promise<Image[]> {
    return this.imageRepository.find({ where: { originalName: name } });
  }

  async softDelete(id: string): Promise<number | null | undefined> {
    const res = await this.imageRepository.softDelete(id);
    return res.affected;
  }

  async remove(images: Image[]): Promise<Image[]> {
    return await this.imageRepository.remove(images);
  }
}
