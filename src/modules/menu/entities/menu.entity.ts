import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { Dish } from '../../dish/entities/dish.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 128 })
  name!: string;

  @Column({ length: 4096, nullable: true })
  description?: string;

  @ManyToMany(() => Dish, (dish) => dish.menus, { eager: true })
  @JoinTable()
  dishes?: Dish[];

  // @OneToMany(() => Image, (image) => image.figure, { eager: true })
  // images?: Image;

  @UpdateDateColumn()
  updateDate!: Date;

  @CreateDateColumn()
  createDate!: Date;

  @VersionColumn({ default: 1 })
  version!: number;
}
