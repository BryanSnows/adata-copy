import { useRef } from 'react';

export function useDebounce(fn: Function, delay: number) {
  const timeoutRef = useRef(0);

  function debounceFn(...params: any) {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      fn(...params);
    }, delay);
  }

  return debounceFn;
}
