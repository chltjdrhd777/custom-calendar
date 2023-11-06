import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { getClassName } from './getClassName';
import { Dispatch, SetStateAction } from 'react';

interface GetSignleDateInfoParams {
  targetTime?: Dayjs;
  isPickerOpen?: null | boolean;
  setIsPickerOpen?: Dispatch<SetStateAction<null | boolean>>;
  setTargetTime?: Dispatch<SetStateAction<dayjs.Dayjs>>;
  setInputValue?: Dispatch<
    SetStateAction<{
      decade: string;
      year: string;
      month: string;
      date: string;
    }>
  >;
  selectedValue?: string;
  setSelectedValue?: Dispatch<SetStateAction<string>>;
  setIsInputFocused?: Dispatch<SetStateAction<boolean>>;
}

export function getSignleDateInfo({
  targetTime,
  isPickerOpen,
  setIsPickerOpen,
  setTargetTime,
  setInputValue,
  selectedValue,
  setSelectedValue,
  setIsInputFocused,
}: GetSignleDateInfoParams = {}) {
  const _dayjs = dayjs();
  const _targetTime = targetTime ?? dayjs();
  const prevMonth = _targetTime.subtract(1, 'month').endOf('month');
  const currentMonth = _targetTime.date(1);
  const nextMonth = _targetTime.add(1, 'month').date(1);

  const prevLastDay = prevMonth.day();
  const currentLastDate = _targetTime.endOf('month').date();
  const currentLastDay = _targetTime.endOf('month').day();

  const prevDates: Dayjs[] = [];
  const currentDates = Array(currentLastDate)
    .fill(null)
    .map((_, i) => currentMonth.add(i, 'day'));
  const nextDates: Dayjs[] = [];

  const calculatePrevDates = (prevDates: Dayjs[]) => {
    if (prevLastDay !== 6) {
      for (let i = 0; i < prevLastDay + 1; i++) {
        prevDates.unshift(prevMonth.subtract(i, 'day'));
      }
    }
  };
  const calculateNextDates = (prevDates: Dayjs[], currentDates: Dayjs[], nextDates: Dayjs[]) => {
    for (let i = 0; i < 6 - currentLastDay; i++) {
      nextDates.push(nextMonth.add(i, 'day'));
    }

    const mergedDates = [...prevDates, ...currentDates, ...nextDates];

    if (mergedDates.length !== 42) {
      const restDatesLength = 42 - mergedDates.length;

      for (let i = 1; i <= restDatesLength; i++) {
        const lastNextDate = nextDates[nextDates.length - 1] ?? currentDates[currentDates.length - 1];
        nextDates.push(lastNextDate.add(1, 'day'));
      }
    }
  };
  const isSameDate = (firstMetaDate: dayjs.Dayjs, secondMetadate: dayjs.Dayjs) => {
    const isSameYear = firstMetaDate.year() === secondMetadate.year();
    const isSameMonth = firstMetaDate.month() === secondMetadate.month();
    const isSameDate = firstMetaDate.date() === secondMetadate.date();
    return isSameYear && isSameMonth && isSameDate;
  };
  const getTransformedDate = (metaDate: Dayjs, blacklist: ('year' | 'month' | 'date')[] = []) => {
    const transformedDate = {
      year: String(metaDate.year()),
      month: _dayjs.month(metaDate.month()).format('MM'),
      date: _dayjs.date(metaDate.date()).format('DD'),
    };

    if (blacklist.length) {
      blacklist.forEach((blacklist) => {
        delete transformedDate[blacklist];
      });
    }

    return transformedDate;
  };
  const setResultInputValue = (metaDate: Dayjs) => {
    const { year, month, date } = getTransformedDate(metaDate);
    setInputValue && setInputValue((prev) => ({ ...prev, year, month, date }));
  };

  const onMouseEnter = (metaDate: Dayjs) => {
    setResultInputValue(metaDate);
  };
  const onMouseLeave = () => {
    if (!selectedValue) {
      setInputValue && setInputValue((prev) => ({ ...prev, date: '' }));
    } else {
      const selectedDate = dayjs(selectedValue);
      setResultInputValue(selectedDate);
    }
  };
  const onClick = (metaDate: Dayjs) => {
    setResultInputValue(metaDate);
    setTargetTime && setTargetTime(metaDate);
    setSelectedValue && setSelectedValue(metaDate.format('YYYY-MM-DD'));
    setIsPickerOpen && setIsPickerOpen(false);
  };

  calculatePrevDates(prevDates);
  calculateNextDates(prevDates, currentDates, nextDates);

  return {
    prevDates: prevDates.map((metaData) => {
      const className = getClassName(['date', 'extra-date']);

      return (
        <td
          className={className}
          onMouseEnter={(e) => onMouseEnter(metaData)}
          onMouseLeave={(e) => onMouseLeave()}
          onClick={(e) => onClick(metaData)}
        >
          <span>{metaData.date()}</span>
        </td>
      );
    }),
    currentDates: currentDates.map((metaData) => {
      const isToday = isSameDate(metaData, dayjs());
      const isSelectedDate = isSameDate(metaData, dayjs(selectedValue));
      const className = getClassName(['date', { today: isToday }, { selectedDate: isSelectedDate }]);

      return (
        <td
          className={className}
          onMouseEnter={(e) => onMouseEnter(metaData)}
          onMouseLeave={(e) => onMouseLeave()}
          onClick={(e) => onClick(metaData)}
        >
          <span>{metaData.date()}</span>
        </td>
      );
    }),
    nextDates: nextDates.map((metaData) => {
      const className = getClassName(['date', 'extra-date']);

      return (
        <td
          className={className}
          onMouseEnter={(e) => onMouseEnter(metaData)}
          onMouseLeave={(e) => onMouseLeave()}
          onClick={(e) => onClick(metaData)}
        >
          <span>{metaData.date()}</span>
        </td>
      );
    }),
    onClick,
  } as const;
}
