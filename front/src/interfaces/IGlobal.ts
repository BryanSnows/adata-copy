export interface ILogin {
  user: string;
  password: string;
}

export interface IUser {
  user_id?: number;
  user_name: string;
  user_email: string;
  user_enrollment: string;
  user_status?: boolean;
  user_profile_id: number;
  user_shift_id: number;
  office_id: number;
  user_password_status?: boolean;
  user_password?: string;
  user_first_access?: boolean;
  user_refresh_token?: null | string;
  shift?: IShift;
  profile?: IProfile;
  office?: IOffice;
  user_mes_id: string;
}

export interface IShift {
  shift_id: number;
  shift_name: string;
  shift_status: boolean;
}

export interface IProfile {
  profile_id: number;
  profile_name: string;
}

export interface IOffice {
  office_id: number;
  oficce_name: string;
  office_status: boolean;
}

export interface ICabinet {
  cabinet_id: number;
  cabinet_name: string;
  cabinet_status: boolean;
  cabinet_side: string;
}

export interface ISnList {
  cabinet_name: string;
  created_at: string;
  customer: string;
  model_name: string;
  mst_name: string;
  position: number;
  serial_number: number;
  sn_list_history_id: number;
  status: boolean;
  work_order_number: number;
}
