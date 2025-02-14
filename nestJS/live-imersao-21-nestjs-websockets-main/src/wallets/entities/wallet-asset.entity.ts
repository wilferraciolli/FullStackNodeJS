import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Wallet } from './wallet.entity';
import { Asset } from '../../assets/entities/asset.entity';

@Entity()
@Unique(['walletId', 'assetId'])
export class WalletAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Wallet)
  wallet: Wallet;

  @Column()
  walletId: number;

  @ManyToOne(() => Asset)
  asset: Asset;

  @Column()
  assetId: string;

  @Column()
  shares: number;
}
