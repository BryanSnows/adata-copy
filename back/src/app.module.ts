import { WebsocketModule } from './websocket/websocket.module';
import { WorkOrderModule } from './work-order/work-order.module';
import { SerialModule } from './serial/serial.module';
import { SlotDefectModule } from './slot-defect/slot-defect.module';
import { TravelCardModule } from './travel-card/travel-card.module';
import { ProcessModule } from './process/process.module';
import { RedisModule } from './config/cache/redis.module';
import { MesConsumeModule } from './mes-consume/mes-consume.module';
import { MesApiModule } from './shared/services/external/mes-api/mes-api.module';
import { Module } from '@nestjs/common';
import { SwaggerModule } from './config/swagger/swagger.module';
import { ConfigModule } from './config/environments/config.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './config/database/database.module';
import { JwtAuthGuard } from './auth/shared/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AccessControlModule } from './access-control/access-control.module';
import { ShiftModule } from './shift/shift.module';
import { OfficeModule } from './office/office.module';
import { BlisterModule } from './blister/blister.module';
import { CabinetModule } from './cabinet/cabinet.module';
import { MstModule } from './mst/mst.module';
import { SnListModule } from './sn-list/sn-list.module';
import { AxiosHttpModule } from './config/http/http.module';
@Module({
  imports: [
    AxiosHttpModule,
    SwaggerModule,
    ConfigModule,
    DatabaseModule,
    AuthModule,
    AccessControlModule,
    UserModule,
    MesConsumeModule,
    MesApiModule,
    JwtAuthGuard,
    ShiftModule,
    OfficeModule,
    BlisterModule,
    CabinetModule,
    MstModule,
    RedisModule,
    ProcessModule,
    TravelCardModule,
    SerialModule,
    SlotDefectModule,
    WebsocketModule,
    WorkOrderModule,
    SnListModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ]
})
export class AppModule { }
