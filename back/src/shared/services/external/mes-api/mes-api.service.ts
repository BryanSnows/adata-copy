import { Injectable } from '@nestjs/common';
import * as mes_response from './data/mes-response.json';

@Injectable()
export class MesApiService {

   async addAprovedSerials() {
      return mes_response['TEST'];
   }

   async getMesUserById(user_mes_id: string) {
      const result = mes_response.GET_EMPNAME.find(employee => employee.EMPLOYEE_ID === user_mes_id)?.EMPLOYEE_INFO.toString()
      return result
   }

   async getWorkOrderInfo(work_order_number: string) {
      return mes_response.GET_SSD_TEST_INFO.find(work_order => work_order.WORK_ORDER_NUMBER === work_order_number)?.WORK_ORDER_INFO;
   }

   async getWorkOrderBySerial(serial_number: string) {
      return mes_response.GET_SSD_TEST_INFO.find(work_order => work_order.SERIALS.includes(serial_number))?.GET_WO_BY_SN;
   }
}
