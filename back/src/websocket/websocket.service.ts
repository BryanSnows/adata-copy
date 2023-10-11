import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { Server } from 'socket.io';
import { RedisService } from 'src/config/cache/redis.service';
import { MstService } from 'src/mst/mst.service';
import { SituationEnum } from 'src/process/enums/situation.enum';
import { percentage } from 'src/shared/helpers/percentage.helper';
import { CachedProcessInterface } from 'src/shared/interfaces/cached-process.interface';
import { addMinutesToDateHour } from './helpers/add-minutes-to-hours';
import { getMinutesFromRdtTime } from './helpers/get-minutes-from-rdt-time.helper';
import { remainingTime } from './helpers/remaining-time.helper';
import { DashboardEventInterface } from './interfaces/dashboard-event.interface';

@WebSocketGateway({ cors: true })
export class WebsocketService {

    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly redisService: RedisService,
        private readonly mstService: MstService,
    ) {}

    @WebSocketServer()
    public server: Server
    

    @SubscribeMessage('get-mst-status')
    async sendMstStatus(
        @MessageBody() body?: any
    ): Promise<DashboardEventInterface> {

        let dashboad_event: DashboardEventInterface = {
            total_ssds: 0,
            msts: [],
            mst_to_finalize: {
                mst_name: "",
                cabinet_name: "",
                work_order: 0,
                customer: '',
                capacity_percentage: 0,
                ssd_quantity: 0,
                remaining_time: "00:00:00",
                test_time_percentage: 0,
            }
        }

        const msts = await this.mstService.getAll();

        msts.forEach((mst) => {
            if (mst.mst_status) {
                dashboad_event.msts.push({
                    mst_name: mst.mst_name,
                    cabinet_name: "",
                    work_order: 0,
                    customer: '',
                    capacity_percentage: 0,
                    ssd_quantity: 0,
                    remaining_time: "00:00:00",
                    test_time_percentage: 0,
                });
            }
        });

        const cached_processes = await this.redisService.getArrayBykeyPath<CachedProcessInterface>('processes*');

        if (cached_processes.length) {
            cached_processes.forEach((process) => {
                process.slots?.forEach((slot, index, array) => {

                    const minutes_rdt_time = getMinutesFromRdtTime(process.work_order.rdt_time);
                    const final_test_time = addMinutesToDateHour(slot.created_at, minutes_rdt_time);

                    const { remaining_time, test_time_percentage } = remainingTime(minutes_rdt_time, slot.created_at, final_test_time);

                    const time_is_not_number = isNaN(Number(remaining_time.split(':')[0]));
                    const mst_usage = array.filter((item) => item.mst_name === slot.mst_name).length;
                
                    if ((slot.situation_id === SituationEnum.SDD_INIT_TESTING) && !time_is_not_number) {
            
                        let current_mst = dashboad_event.msts.find((mst) => mst.mst_name === slot.mst_name);
                        let currentIndex = dashboad_event.msts.findIndex((mst) => mst.mst_name === slot.mst_name);
                        
                        current_mst.cabinet_name = slot.cabinet_name;
                        current_mst.work_order = process.work_order.work_order_number;
                        current_mst.customer = process.work_order.customer;
                        current_mst.capacity_percentage = percentage(mst_usage, 360);
                        current_mst.ssd_quantity = mst_usage;
                        current_mst.remaining_time = remaining_time;
                        current_mst.test_time_percentage = test_time_percentage;
        
                        dashboad_event.msts[currentIndex] = current_mst;
                    }
                });
            });
        }

        dashboad_event.msts.forEach((mst) => {
            dashboad_event.total_ssds += mst.ssd_quantity;
        });

        if (dashboad_event.total_ssds > 0) {
            dashboad_event.mst_to_finalize = dashboad_event.msts.filter(mst => mst.ssd_quantity > 0).reduce((accumulator, currentValue) => {
                return accumulator.remaining_time < currentValue.remaining_time ? accumulator : currentValue;
            });
        }

        this.server.emit('mst-status', dashboad_event);
        return dashboad_event;
    }
}
