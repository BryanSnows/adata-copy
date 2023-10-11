export interface IControlProfile {
  profile_id: number,
  profile_name: string,
  transactions: ITransaction[];
}

export interface ITransaction {
  transaction_id: number,
  transaction_name: string,
  transaction_number: number,
  transaction_status: boolean
}

export interface IControlProfileEdit {
  profiles: IProfileEdit[]
}

export interface IProfileEdit {
  profile_id: number;
  transaction_ids: number[];
}