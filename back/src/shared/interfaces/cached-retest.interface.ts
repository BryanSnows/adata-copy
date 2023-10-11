import { WorkOrderInterface } from "./work-order.interface";

export class CachedRetestInterface {
    work_order: WorkOrderInterface;
    serials: string[];
}