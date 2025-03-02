import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChannelsService {
  // constructor(private authService: AuthService) {}
  //
  getUserFromSocket(socket: Socket): string {
    let auth_token: string | undefined = socket.handshake.headers.authorization;
    // get the token itself without "Bearer"
    auth_token = auth_token?.split(' ')[1];

    if (!auth_token) {
      throw new WsException('Invalid credentials.');
    }

    return auth_token;
  }

  //
  // public async getUserFromAuthenticationToken(token: string) {
  //   const payload: JwtPayload = this.jwtService.verify(token, {
  //     secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
  //   });
  //
  //   const userId = payload.sub
  //
  //   if (userId) {
  //     return this.usersService.findById(userId);
  //   }
  // }
}
