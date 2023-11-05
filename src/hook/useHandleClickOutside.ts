import { MutableRefObject, useEffect } from 'react';

export function useHandleClickOutside(targetRef: MutableRefObject<Node | null>, callback: (...args: any) => any) {
  useEffect(() => {
    const onHandleClickOutside = (e: MouseEvent) => {
      if (!targetRef.current?.contains(e.target as Node)) {
        callback();
      }
    };
    window.addEventListener('click', onHandleClickOutside);
    return () => window.removeEventListener('click', onHandleClickOutside);
  }, []);
}
