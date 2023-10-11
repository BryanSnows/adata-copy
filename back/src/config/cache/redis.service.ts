import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly configService: ConfigService
    ) { }

    async getArrayBykeyPath<T>(keyPath: string): Promise<T[]> {
        const keys = await this.cacheManager.store.keys(`adata:${keyPath}*`);

        return await Promise.all(
            keys.map(async (key: string) => this.cacheManager.get<T>(key))
        );
    }

    async getByKeyValue<T>(key: string, obj_key: string, obj_value: string): Promise<T> {
        const processes = await this.getArrayBykeyPath<T>(key);
        return processes.find((process) => process[obj_key] === obj_value);
    }

    async getByKeyValueArray<T>(cache_key: string, obj_array_key: string, obj_key: string, obj_value: string): Promise<T> {
        const processes = await this.getArrayBykeyPath<T>(cache_key);
        return processes.find((process) => {
            if (Array.isArray(process[obj_array_key])) {
                return process[obj_array_key].find((process) => process[obj_key] === obj_value);
            }
        });
    }
}
