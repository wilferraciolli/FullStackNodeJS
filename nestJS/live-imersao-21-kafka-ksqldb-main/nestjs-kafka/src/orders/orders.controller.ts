import { Body, Controller, OnModuleInit, Post } from '@nestjs/common';
import * as kafkaLib from '@confluentinc/kafka-javascript';

@Controller('orders')
export class OrdersController implements OnModuleInit {
  private producer: kafkaLib.KafkaJS.Producer;

  constructor(private kafkaInst: kafkaLib.KafkaJS.Kafka) {}

  async onModuleInit() {
    this.producer = this.kafkaInst.producer();
    await this.producer.connect();
  }

  @Post()
  async createOrder(
    @Body() body: { product_id: number; price: number; quantity: number },
  ) {
    console.log(body);
    await this.producer.send({
      topic: 'orders',
      messages: [
        {
          value: JSON.stringify({
            event: 'order.created',
            order_id: Math.floor(Math.random() * 10000) + 1,
            customer_id: Math.floor(Math.random() * 1000) + 1,
            product_id: body.product_id,
            quantity: body.quantity,
            price: body.price,
          }),
        },
      ],
    });
    return { success: true };
  }
}
