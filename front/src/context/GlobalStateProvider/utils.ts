import { useContext } from 'react';
import { GlobalStateContext } from './index';

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
