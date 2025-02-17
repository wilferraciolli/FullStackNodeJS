import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import * as kafkaLib from '@confluentinc/kafka-javascript';
import { OrdersConsumer } from './orders.consumer';

@Module({
  controllers: [OrdersController, OrdersConsumer],
  providers: [
    {
      provide: kafkaLib.KafkaJS.Kafka,
      useFactory() {
        return new kafkaLib.KafkaJS.Kafka({
          'bootstrap.servers': 'localhost:9094',
        });
      },
    },
  ],
})
export class OrdersModule {}
