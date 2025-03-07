import {
  ConnectedSocket,
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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChannelGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private _server: Server;

  constructor(
    private _channelService: ChannelsService,
    private _logger: Logger,
  ) {}

  public handleConnection(client: Socket): void {
    const authHeader: string | undefined =
      client.handshake.headers.authorization;
    this._logger.log('Client connected auth header ', authHeader);

    const resourceIdQueryParam: string = client.handshake.query
      .resourceId as string;
    this._logger.log(
      'Client connected resourceId param ' + resourceIdQueryParam,
    );

    this._server.emit('client-connected', {
      message: `Client connected: ${client.id}`,
    });
  }

  public handleDisconnect(client: Socket): void {
    this._logger.log('Client disconnected ' + client.id);
    this._server.emit('client-disconnected', {
      message: `Client disconnected: ${client.id}`,
    });
  }

  @SubscribeMessage('channels')
  public listenForMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: ChannelInterface,
  ): void {
    this._logger.log('Client message ' + client?.id);
    // client.emit('reply', message); // send back only to the sender
    client.broadcast.emit('reply', message); // broadcast to all except the sender
    // this.server.emit('reply', message); // broadcast to all
  }
}
