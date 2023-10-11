import { WebsocketService } from './websocket.service';
import { Module } from '@nestjs/common';
import { RedisModule } from 'src/config/cache/redis.module';
import { MstModule } from 'src/mst/mst.module';

@Module({
    imports: [
        RedisModule,
        MstModule
    ],
    controllers: [],
    providers: [
        WebsocketService
    ],
    exports: [
        WebsocketService
    ]
})
export class WebsocketModule { }
