import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { Dish } from '../../dish/entities/dish.entity';

@Entity()
export class Image {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ length: 512, default: '' })
  originalName!: string;

  @Column({ length: 128 })
  bucket!: string;

  @Column({ length: 512 })
  key!: string;

  @Column({ length: 512 })
  location!: string;

  @OneToOne(() => Dish, (dish) => dish.image)
  dish?: Dish[];

  @Column('simple-array', { default: '' })
  scales!: string[];

  @UpdateDateColumn()
  updateDate!: Date;

  @DeleteDateColumn()
  deleteDate!: Date;

  @CreateDateColumn()
  createDate!: Date;

  @VersionColumn({ default: 1 })
  version!: number;
}
