import { Logger, Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { ChannelGateway } from './channels.gateway';

@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService, ChannelGateway, Logger],
  exports: [ChannelsService],
})
export class ChannelsModule {}
