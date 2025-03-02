import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelsService } from './channels.service';
import { Logger } from '@nestjs/common';
import { ChannelInterface } from './interfaces/channel.interface';

@WebSocketGateway()
export class ChannelGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private _channelService: ChannelsService,
    private _logger: Logger,
  ) {}

  handleConnection(client: Socket): void {
    const authHeader: string | undefined = client.handshake.headers.authorization;
    this._logger.log('Client connected auth header', authHeader);

    const resourceIdQueryParam: string = client.handshake.query
      .resourceId as string;
    this._logger.log('Client connected resourceId param', resourceIdQueryParam);

    this.server.emit('client-connected', {
      message: `Client connected: ${client.id}`,
    });
  }

  handleDisconnect(client: Socket): void {
    this._logger.log('Client disconnected ', client.id);
    this.server.emit('client-disconnected', {
      message: `Client disconnected: ${client.id}`,
    });
  }

  @SubscribeMessage('channels')
  listenForMessages(@MessageBody() message: ChannelInterface) {
    // client.emit('reply', message); // send back to the sender
    this.server.emit('reply', message); // broadcast to all but the sender
  }
}
