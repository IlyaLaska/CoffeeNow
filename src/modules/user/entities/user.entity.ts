import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { Resource } from '../../resource/entities/resource.entity';

@Entity()
export class User {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ length: 256 })
  name!: string;

  @Column({ length: 256, nullable: true })
  initialEmail?: string;

  @ManyToMany(() => Resource, (resource) => resource.users, { cascade: true })
  @JoinTable()
  resources!: Resource[];

  @UpdateDateColumn()
  updateDate!: Date;

  @CreateDateColumn()
  createDate!: Date;

  @VersionColumn({ default: 1 })
  version!: number;
}
