export interface IAuthContext {
  transactions?: number[];
  userName?: string;
  errorLogin?: string;
  profile?: string;
  mensageAttempts?: string;
  setMensageError?: (value: string) => void;
  setMensageAttempts?: (value: string) => void;
  mensageError?: string;
  Logout?: (boolean) => void;
  handleLogin?: (user, password) => void;
  newPassword?: boolean;
  firstPassword?: string;
  setNewPassword?: (value: boolean) => void;
  userValidation?: boolean;
}

export interface IAuthProvider {
  children: JSX.Element;
}

export interface IUser {
  enrollment?: number;
  exp: number;
  name: string;
  iat: number;
  transactions: number[];
}
