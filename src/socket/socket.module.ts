import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [SocketGateway, ConfigService],
  exports: [SocketGateway],
})
export class SocketModule {}
