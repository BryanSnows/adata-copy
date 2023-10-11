import { WorkOrderInterface } from "./work-order.interface";

export interface CachedSlots {
    work_order_number: number
    is_filled_cabinet?: boolean;
    cabinet_name: string;
    mst_name: string;
    serial_number: string;
    position: number;
    situation_id: number;
    created_at: Date;
    status: null | boolean;
    test_serial_count: number;
    test_position_count: number;
}
export interface CachedProcessInterface {
    work_order: WorkOrderInterface;
    user_mes_id?: number;
    slots: CachedSlots[];
    created_at?: Date;
    is_ended?: boolean;
    is_paused?: boolean;
    is_exception?: boolean;
    is_ended_exception?: boolean;
}