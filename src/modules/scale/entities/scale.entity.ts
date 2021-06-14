import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Scale {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  scale!: number;
}
