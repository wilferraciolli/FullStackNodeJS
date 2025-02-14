import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { Asset } from '../../assets/entities/asset.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Wallet)
  wallet: Wallet;

  @Column()
  walletId: number;

  @ManyToOne(() => Asset)
  asset: Asset;

  @Column()
  assetId: number;

  //shares significa a quantidade de ações que o usuário deseja comprar ou vender
  //em inglês, representa a unidade de valor de uma empresa
  @Column({ type: 'int' })
  shares: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
