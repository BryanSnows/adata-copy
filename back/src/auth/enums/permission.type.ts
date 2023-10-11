import { ShiftTransaction } from "./transactions/shift.transaction";
import { UserTransaction } from "./transactions/user.transaction";
import { BlisterTransaction } from "./transactions/blister.trasaction";
import { OfficeTransaction } from "./transactions/office.transaction";
import { CabinetTransaction } from "./transactions/cabinet.transaction";
import { MstTransaction } from "./transactions/mst.transaction";
import { SnListTransaction } from "./transactions/sn-list.transaction";
import { TravelCardTransaction } from "./transactions/travel-card.transaction";
import { SerialExceptionTransaction } from "./transactions/serial-exception.transaction";
import { ProductivityTransaction } from "./transactions/productivity.tansaction";
import { OccupationTransaction} from "./transactions/ocupation.transaction";
import { FpyTransaction } from "./transactions/fpy.transaction";
import { SlotDefectTransaction } from "./transactions/slot-defect.transaction";
import { AccessControlTransaction } from "./transactions/access-control.transaction";
import { ProcessTransaction } from "./transactions/process.transaction";

let Permission = {
    User: UserTransaction,
    Shift: ShiftTransaction,
    Blister:  BlisterTransaction, 
    Office: OfficeTransaction, 
    Cabinet: CabinetTransaction,
    Mst: MstTransaction,
    SnList: SnListTransaction,
    Travelcard: TravelCardTransaction,
    SlotsDefects: SlotDefectTransaction,
    SerialException: SerialExceptionTransaction,
    Process: ProcessTransaction,
    Productivity: ProductivityTransaction,
    Occupation: OccupationTransaction,
    Fpy: FpyTransaction,
    AccessControl: AccessControlTransaction
}

export default Permission;