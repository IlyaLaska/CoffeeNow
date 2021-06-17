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

import { Role } from '../../role/entities/role.entity';

@Entity()
export class User {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ length: 256 })
  name!: string;

  @Column({ length: 256, nullable: true })
  initialEmail?: string;

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable()
  roles!: Role[];

  @CreateDateColumn()
  createDate!: Date;

  @UpdateDateColumn()
  updateDate!: Date;

  @VersionColumn({ default: 1 })
  version!: number;
}
