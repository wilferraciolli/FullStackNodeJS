import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset } from '../assets/entities/asset.entity';
import { AssetsGateway } from '../assets/assets.gateway';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Asset) private assetRepository: Repository<Asset>,
    private assetsGateway: AssetsGateway,
  ) {}

  async create(data: {
    walletId: number;
    assetId: number;
    shares: number;
    price: number;
  }) {
    const order = this.orderRepository.create(data);
    const orderCreated = await this.orderRepository.save(order);
    //mais coisas acontecem aqui
    //evento - atualizassem o valor do ativo
    const asset = await this.assetRepository.findOne({
      where: { id: data.assetId },
    });
    this.assetsGateway.notifyNewPrice(asset!);
    //notificar
    return orderCreated;
  }

  trade() {
    //terminar a negociação
  }
}
