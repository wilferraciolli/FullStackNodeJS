import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsModule } from './assets/assets.module';
import { Asset } from './assets/entities/asset.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { DataSource } from 'typeorm';
import { WalletsModule } from './wallets/wallets.module';
import * as bcrypt from 'bcrypt';
import { Wallet } from './wallets/entities/wallet.entity';
import { WalletAsset } from './wallets/entities/wallet-asset.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      host: 'localhost',
      type: 'mysql',
      port: 3306,
      database: 'nestjs',
      username: 'root',
      password: 'root',
      entities: [Asset, User, Wallet, WalletAsset, Order],
      synchronize: true,
    }),
    AuthModule,
    AssetsModule.forRoot(),
    UsersModule,
    WalletsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    //truncate all tables
    await this.dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    await this.dataSource.query('TRUNCATE TABLE asset');
    await this.dataSource.query('TRUNCATE TABLE user');
    await this.dataSource.query('TRUNCATE TABLE wallet');
    await this.dataSource.query('TRUNCATE TABLE wallet_asset');
    await this.dataSource.query('TRUNCATE TABLE `order`');
    await this.dataSource.query('SET FOREIGN_KEY_CHECKS = 1');

    const userRepo = this.dataSource.getRepository(User);
    const user = userRepo.create({
      id: 1,
      name: 'Customer 1',
      email: 'customer1@user.com',
      password: bcrypt.hashSync('secret', 10),
    });
    await userRepo.save(user);

    const assetRepo = this.dataSource.getRepository(Asset);
    const asset = assetRepo.create({
      id: 1,
      symbol: 'BTC',
      price: 100,
    });
    await assetRepo.save(asset);

    const walletRepo = this.dataSource.getRepository(Wallet);
    const wallet = walletRepo.create({
      id: 1,
      userId: user.id,
    });
    await walletRepo.save(wallet);
  }
}
