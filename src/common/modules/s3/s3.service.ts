import { Injectable } from '@nestjs/common';
import { AWSError, S3 } from 'aws-sdk';
import { DeleteObjectsOutput } from 'aws-sdk/clients/s3';
import { PromiseResult } from 'aws-sdk/lib/request';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import sharp from 'sharp';
import stream from 'stream';

import { MAX_S3_DELETIONS } from '../../constants';
import { ConfigService } from '../config/config.service';
import { S3ResponseType } from './types/s3-response-type';

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {}

  uploadFile(
    fileName: string,
    stream: NodeJS.ReadableStream,
    mimetype?: string,
    ACL = 'public-read',
  ): Promise<ManagedUpload.SendData> {
    const s3Stream = new S3(this.configService.s3Config);
    return s3Stream
      .upload({
        Bucket: this.configService.s3Bucket,
        Key: fileName,
        Body: stream,
        ACL,
        ContentType: mimetype,
      })
      .promise();
  }

  deleteFile(key: string): Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>> {
    const s3Stream = new S3(this.configService.s3Config);
    return s3Stream.deleteObject({ Bucket: this.configService.s3Bucket, Key: key }).promise();
  }

  deleteFiles(keys: string[]): Promise<(S3.DeleteObjectsOutput & S3ResponseType)[]> {
    const awsKeys = keys.map((key) => {
      return { Key: key };
    });
    const promises: Promise<PromiseResult<DeleteObjectsOutput, AWSError>>[] = [];
    const s3Stream = new S3(this.configService.s3Config);
    for (let i = 0; i < awsKeys.length; i += MAX_S3_DELETIONS) {
      const arrPart = awsKeys.slice(i, i + MAX_S3_DELETIONS);
      promises.push(
        s3Stream.deleteObjects({ Bucket: this.configService.s3Bucket, Delete: { Objects: arrPart } }).promise(),
      );
    }
    return Promise.all(promises);
  }

  downloadFile(key: string): Promise<PromiseResult<S3.GetObjectOutput, AWSError>> {
    const s3Stream = new S3(this.configService.s3Config);
    return s3Stream.getObject({ Bucket: this.configService.s3Bucket, Key: key }).promise();
  }

  downloadFileStream(key: string): stream.Readable {
    const s3Stream = new S3(this.configService.s3Config);
    return s3Stream.getObject({ Bucket: this.configService.s3Bucket, Key: key }).createReadStream();
  }

  uploadStream(fileName: string, sharpStream: sharp.Sharp, mimetype?: string): Promise<ManagedUpload.SendData> {
    const s3Stream = new S3(this.configService.s3Config);
    const pass = new stream.PassThrough();
    const promise = s3Stream
      .upload({
        Bucket: this.configService.s3Bucket,
        Key: fileName,
        Body: pass,
        ACL: 'public-read',
        ContentType: mimetype,
      })
      .promise();
    sharpStream.pipe(pass);
    return promise;
  }
}
