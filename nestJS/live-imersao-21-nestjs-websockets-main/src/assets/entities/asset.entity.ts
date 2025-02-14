import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
