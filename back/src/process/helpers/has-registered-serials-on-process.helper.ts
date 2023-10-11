import { ConflictException } from "@nestjs/common";
import { CabinetPositionInterface } from "../interfaces/cabinet-position.interface";

export function hasRegisteredSerialsOnProcess(registered_serials: string[], serials_on_request: string[]) {
    serials_on_request.forEach((serial_request) => {
        if (registered_serials.includes(serial_request)) {
            throw new ConflictException(`Serial ${serial_request} já foi cadastrado!`);
        }
    });
}

export function hasRegisteredCabinetAndPositionsOnProcess(registered_positions: CabinetPositionInterface[], positions_on_request: CabinetPositionInterface[]) {

    positions_on_request.forEach((position_request) => {
        registered_positions.forEach((registered_position) => {
            if (objectsEqual(registered_position, position_request)) {
                throw new ConflictException(`Posição ${position_request.position} já está sendo utilizada!`);
            }
        })
    });
}

function objectsEqual (o1: Object, o2: Object) {
    if (Object.keys(o1).length === Object.keys(o2).length && Object.keys(o1).every(p => o1[p] === o2[p])) {
        return true;
    }
    return false;
}