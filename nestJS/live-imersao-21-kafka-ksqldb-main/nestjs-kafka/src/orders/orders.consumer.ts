import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class OrdersConsumer {
  @EventPattern('ORDERS_SUMMARY_TIME')
  handle(@Payload() message) {
    console.log(message);
  }
}
