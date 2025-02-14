import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Asset } from '../assets/entities/asset.entity';
import { Wallet } from '../wallets/entities/wallet.entity';
import { OrdersGateway } from './orders.gateway';
import { OrdersService } from './orders.service';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Asset, Wallet]),
    AssetsModule.forGateway(),
  ],
  providers: [OrdersGateway, OrdersService],
})
export class OrdersModule {}
