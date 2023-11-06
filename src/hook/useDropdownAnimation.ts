import React, { useEffect } from 'react';

function useDropdownAnimation(targetRef: React.MutableRefObject<HTMLDivElement | null>, isPickerOpen: null | boolean) {
  useEffect(() => {
    if (isPickerOpen !== null) {
      targetRef.current?.classList.remove('dropdown');
      targetRef.current?.classList.remove('dropdown-reverse');
      void targetRef.current?.offsetWidth;
      const classname = isPickerOpen ? 'dropdown' : 'dropdown-reverse';

      targetRef.current?.classList.add(classname);
    }
  }, [isPickerOpen, targetRef]);
}

export default useDropdownAnimation;
