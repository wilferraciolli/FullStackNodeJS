import { Logger, Module } from '@nestjs/common';
import { RoomsGateway } from './rooms.gateway';

@Module({
  controllers: [],
  providers: [RoomsGateway, Logger],
  exports: [],
})
export class RoomsModule {}
