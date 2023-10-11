import { RedisService } from './redis.service';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get('redis.host'),
                port: configService.get('redis.port'),
                auth_pass: configService.get('redis.password'),
                ttl: configService.get('redis.ttl'),
                isGlobal: true,
            }),
            inject: [ConfigService]
        })],
    providers: [
        RedisService,
    ],
    exports: [
        CacheModule,
        RedisService,
    ]
})
export class RedisModule { }
