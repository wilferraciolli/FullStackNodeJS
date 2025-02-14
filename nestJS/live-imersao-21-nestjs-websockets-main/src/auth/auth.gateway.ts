import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class AuthGateway implements OnGatewayConnection {
  constructor(private jwtService: JwtService) {}

  async handleConnection(client: any, ...args: any[]) {
    //Authorization: Bearer xxxxxxx [Bearer, XXXXX]
    const token = client.handshake.headers?.authorization?.split(' ')[1];
    if (!token) {
      client.disconnect();
      return;
    }
    try {
      const payload: { sub: number } = await this.jwtService.verifyAsync(token);
      client.user = payload.sub;
    } catch (e) {
      client.disconnect();
    }
  }
}
