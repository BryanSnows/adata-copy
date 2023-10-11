class ISlots {
    ssd: string;
    position: string;
}
export class IProcess {
    process_number: number;
    cabinet: number;
    mst: number;
    work_order: number;
    slots: ISlots[]
}