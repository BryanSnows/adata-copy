import jwt_decode from 'jwt-decode';
export interface IAccessToken {
  enrollment?: string;
  name?: string;
  profile_id?: number;
  transactions?: number[];
  user_mes_id?: number;
  iat?: number;
  exp?: number;
}

export function getDecodedToken(): IAccessToken {
  try {
    return jwt_decode(localStorage.getItem('acc_token'));
  } catch (error) {}
}
