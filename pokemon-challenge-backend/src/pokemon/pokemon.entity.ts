import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pokemon {
  @PrimaryGeneratedColumn()
  id: number;
}
