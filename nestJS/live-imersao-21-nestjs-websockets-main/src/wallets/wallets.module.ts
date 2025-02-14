import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletAsset } from './entities/wallet-asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, WalletAsset])],
})
export class WalletsModule {}
