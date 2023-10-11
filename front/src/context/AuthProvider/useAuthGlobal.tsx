import { useContext } from 'react';
import { AuthContext } from '.';

export function useAuthGlobal() {
  return useContext(AuthContext);
}
