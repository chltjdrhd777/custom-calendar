import React, { useEffect } from 'react';

type InputValue = {
  decade: string;
  year: string;
  month: string;
  date: string;
};
function useInputFocus(inputValue: InputValue, targetRef: React.MutableRefObject<HTMLInputElement | null>) {
  useEffect(() => {
    if (inputValue.year || inputValue.month || inputValue.date) {
      targetRef.current?.focus();
    }
  }, [inputValue, targetRef]);
}

export default useInputFocus;
