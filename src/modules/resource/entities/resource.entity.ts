import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 256 })
  name!: string;

  @Column({ nullable: false, update: false, unique: true })
  key!: string;

  @ManyToMany(() => User, (user) => user.resources)
  users!: User[];

  @UpdateDateColumn()
  updateDate!: Date;

  @CreateDateColumn()
  createDate!: Date;

  @VersionColumn({ default: 1 })
  version!: number;
}
