import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { AssetsGateway } from './assets.gateway';

// @Module({
//   imports: [TypeOrmModule.forFeature([Asset])],
//   controllers: [AssetsController],
//   providers: [AssetsService, AssetsGateway],
//   exports: [AssetsGateway],
// })
export class AssetsModule {
  static forRoot() {
    return {
      module: AssetsModule,
      imports: [TypeOrmModule.forFeature([Asset])],
      controllers: [AssetsController],
      providers: [AssetsService],
    };
  }

  static forFeature() {
    return {
      module: AssetsModule,
      imports: [TypeOrmModule.forFeature([Asset])],
      providers: [AssetsService],
      exports: [AssetsService],
    };
  }

  static forGateway() {
    return {
      module: AssetsModule,
      imports: [AssetsModule.forFeature()],
      providers: [AssetsGateway],
      exports: [AssetsGateway],
    };
  }
}
