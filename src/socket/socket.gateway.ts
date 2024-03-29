import { UseFilters, UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsExceptionFilter } from 'src/filter/wsException.filter';
import { WsAuthGuard } from 'src/guard/ws-auth.guard';
import { IEventRealtime, IWsEvents } from 'src/interface/common.interface';

@WebSocketGateway(3333, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  namespace: 'websocket',
})
@UseFilters(WsExceptionFilter)
@UseGuards(WsAuthGuard)
export class SocketGateway {
  @WebSocketServer()
  server: Server<any, IWsEvents>;

  @SubscribeMessage('message')
  async testMessage(): Promise<string> {
    return 'Hello world!';
  }

  async handleMessage(data: IEventRealtime) {
    this.server.emit('messageData', data);
  }
}
