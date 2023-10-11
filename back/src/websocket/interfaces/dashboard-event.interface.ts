class Mst {
    mst_name: string;
    cabinet_name: string;
    work_order: number;
    customer: string;
    capacity_percentage: number;
    ssd_quantity: number;
    remaining_time: string;
    test_time_percentage: number;
}

export class DashboardEventInterface {
    total_ssds: number;
    msts: Mst[];
    mst_to_finalize: Mst
}