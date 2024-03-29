import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient() as WebSocket;
    const _data = ctx.getData();
    const err = exception.getError();
    const _message = exception.message;

    client.send(
      JSON.stringify({
        event: err,
        message: _message,
        timestamp: new Date().toISOString(),
        path: _data.url,
      }),
    );
  }
}
