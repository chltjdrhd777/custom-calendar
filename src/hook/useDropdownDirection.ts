import { MutableRefObject, useEffect } from 'react';

interface UseDropdownDirectionRrops {
  DateRangeRef: MutableRefObject<HTMLDivElement | null>;
  DatePickerPanelRef: MutableRefObject<HTMLInputElement | null>;
}
function useDropdownDirection(
  DateRangeRef: MutableRefObject<HTMLDivElement | null>,
  DatePickerPanelRef: MutableRefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const onHandleDropdownDirection = () => {
      const dateRangeRect = DateRangeRef.current?.getBoundingClientRect();
      const restFromWindowBottom = window.innerHeight - (dateRangeRect?.bottom ?? 0);
      const datePickerPanelHeight = DatePickerPanelRef.current?.clientHeight ?? 0;
      const style = DatePickerPanelRef.current!.style;

      if (datePickerPanelHeight >= restFromWindowBottom) {
        style.transformOrigin = 'bottom left';
        style.top = -(datePickerPanelHeight + 10) + 'px';
      } else {
        style.transformOrigin = 'top left';
        style.top = 'initial';
      }
    };

    window.addEventListener('resize', onHandleDropdownDirection);
    return () => window.removeEventListener('resize', onHandleDropdownDirection);
  }, []);
}

export default useDropdownDirection;
