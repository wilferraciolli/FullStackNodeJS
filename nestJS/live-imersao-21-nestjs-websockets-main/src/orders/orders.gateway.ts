import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { OrdersService } from './orders.service';
import { Repository } from 'typeorm';
import { Wallet } from '../wallets/entities/wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';

@WebSocketGateway()
export class OrdersGateway {
  constructor(
    private ordersService: OrdersService,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    console.log(payload);
    client.emit('response', 'recebi sua mensagem');
  }

  @SubscribeMessage('createOrder')
  async createOrder(
    client: any,
    payload: {
      assetId: number;
      shares: number;
      price: number;
    },
  ) {
    const wallet = await this.walletRepository.findOne({
      where: {
        userId: client.user,
      },
    });
    const orderCreated = await this.ordersService.create({
      walletId: wallet!.id,
      assetId: payload.assetId,
      price: payload.price,
      shares: payload.shares,
    });
    return orderCreated;
  }
}
