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
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 256 })
  name!: string;

  @Column({ nullable: false, update: false })
  key!: string;

  @ManyToMany(() => User, (user) => user.resources)
  users!: User[];

  @CreateDateColumn()
  createDate!: Date;

  @UpdateDateColumn()
  updateDate!: Date;

  @VersionColumn({ default: 1 })
  version!: number;
}
