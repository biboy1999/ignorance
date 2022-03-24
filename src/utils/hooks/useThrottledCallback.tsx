// https://stackoverflow.com/a/59277958
import { DependencyList, useCallback, useEffect, useRef } from "react";

export function useThrottledCallback<A extends unknown[]>(
  callback: (...args: A) => void,
  delay: number,
  deps: DependencyList
): (...args: A) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const callbackRef = useRef(callback);
  const lastCalledRef = useRef(0);

  // Remember the latest callback:
  //
  // Without this, if you change the callback, when setTimeout kicks in, it
  // will still call your old callback.
  //
  // If you add `callback` to useCallback's deps, it will also update, but it
  // might be called twice if the timeout had already been set.

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Clear timeout if the components is unmounted or the delay changes:
  function cleanup(): void {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }
  useEffect(() => cleanup, [delay]);

  return useCallback((...args): void => {
    // Clear previous timer:
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    function invoke(): void {
      callbackRef.current(...args);
      lastCalledRef.current = Date.now();
    }

    // Calculate elapsed time:
    const elapsed = Date.now() - lastCalledRef.current;

    if (elapsed >= delay) {
      // If already waited enough, call callback:
      invoke();
    } else {
      // Otherwise, we need to wait a bit more:
      timeoutRef.current = setTimeout(invoke, delay - elapsed);
    }
  }, deps);
}
