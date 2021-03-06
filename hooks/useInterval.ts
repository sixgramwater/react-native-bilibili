import { useRef, useEffect } from "react";

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<Function>();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current!();
    }
    if (!delay && delay !== 0) {
      return;
    }
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [callback, delay]);
};
