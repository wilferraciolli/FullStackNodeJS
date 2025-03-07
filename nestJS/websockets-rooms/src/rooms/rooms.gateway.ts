import { Logger } from '@nestjs/common';
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
import { ChannelInterface } from './interfaces/room.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private _server: Server;

  constructor(private _logger: Logger) {}

  handleConnection(client: Socket) {
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

  handleDisconnect(client: Socket) {
    console.log('Client disconnected ', client.id);
    this._server.emit('client-disconnected', {
      message: `Client disconnected: ${client.id}`,
    });
  }

  // Allow a client to watch a specific resource
  @SubscribeMessage('watch-resource')
  handleWatchResource(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { resourceId: string },
  ) {
    const roomName = `resource:${data.resourceId}`;
    client.join(roomName);
    this._logger.log(
      `Client ${client.id} is now watching resource ${data.resourceId}`,
    );
    return { success: true, resourceId: data.resourceId };
  }

  // Allow a client to stop watching a resource
  @SubscribeMessage('unwatch-resource')
  handleUnwatchResource(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { resourceId: string },
  ) {
    const roomName = `resource:${data.resourceId}`;
    client.leave(roomName);
    this._logger.log(
      `Client ${client.id} stopped watching resource ${data.resourceId}`,
    );
    return { success: true, resourceId: data.resourceId };
  }

  @SubscribeMessage('channels')
  listenForMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: ChannelInterface,
  ) {
    if (message.resourceId) {
      // Only send the message to clients watching this resource
      const roomName = `resource:${message.resourceId}`;
      this._server.to(roomName).emit('resource-update', message);
      this._logger.debug(`Message sent for resource ${message.resourceId}`);
    } else {
      // If no resourceId is specified, notify only the sender
      client.emit('error', {
        message: 'No resourceId specified in the message',
      });
    }
  }
}
