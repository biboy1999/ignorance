//https://stackoverflow.com/a/57335271
import { DependencyList, useCallback, useEffect, useRef } from "react";

export function useDebouncedCallback<A extends unknown[]>(
  callback: (...args: A) => void,
  wait: number,
  deps: DependencyList
): (...args: A) => void {
  // track args & timeout handle between calls
  const argsRef = useRef<A>();
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  function cleanup(): void {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }
  // make sure our timeout gets cleared if
  // our consuming component gets unmounted
  useEffect(() => cleanup, []);
  return useCallback((...args: A): void => {
    // capture latest args
    argsRef.current = args;
    // clear debounce timer
    cleanup();

    // start waiting again
    timeout.current = setTimeout(() => {
      if (argsRef.current) {
        callback(...argsRef.current);
      }
    }, wait);
  }, deps);
}
