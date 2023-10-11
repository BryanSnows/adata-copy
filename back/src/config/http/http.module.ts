import { Global, Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
    imports: [
        HttpModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            baseURL: configService.get('mes.api_url'),
            headers: {          
              'Authorization': 'Bearer ' + configService.get('mes.api_token')
            },
            timeout: 7000,
            maxRedirects: 5
          }),
          inject: [ConfigService]
        })
    ],
    exports: [
      HttpModule
    ]
})
export class AxiosHttpModule {
  constructor(private readonly httpService: HttpService) {
    this.httpService.axiosRef.interceptors.request.use(config => {
        console.log(config);
        return config;
    });
  }
}
