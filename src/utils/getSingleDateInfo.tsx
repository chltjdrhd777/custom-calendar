import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { getClassName } from './getClassName';

interface GetSignleDateInfoParams {
  targetTime?: Dayjs;
  setInputValue?: React.Dispatch<
    React.SetStateAction<{
      decade: string;
      year: string;
      month: string;
      date: string;
    }>
  >;
}

export function getSignleDateInfo({ targetTime, setInputValue }: GetSignleDateInfoParams = {}) {
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
        const lastNextDate = nextDates[nextDates.length - 1];
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

  calculatePrevDates(prevDates);
  calculateNextDates(prevDates, currentDates, nextDates);

  const onMouseEnter = (metaDate: Dayjs) => {
    const _dayjs = dayjs();
    const year = String(metaDate.year());
    const month = _dayjs.month(metaDate.month()).format('M');
    const date = _dayjs.date(metaDate.date()).format('DD');
    setInputValue && setInputValue((prev) => ({ ...prev, year, month, date }));
  };
  const onMouseLeave = () => {};
  const onClick = (metaDate: Dayjs) => {
    const _dayjs = dayjs();
    const year = String(metaDate.year());
    const month = _dayjs.month(metaDate.month()).format('M');
    const date = _dayjs.date(metaDate.date()).format('DD');
    setInputValue && setInputValue((prev) => ({ ...prev, year, month, date }));
  };

  return {
    prevDates: prevDates.map((metaData) => {
      const className = getClassName(['date', 'extra-date']);

      return (
        <td className={className} onMouseEnter={(e) => onMouseEnter(metaData)} onMouseLeave={(e) => onMouseLeave()}>
          <span>{metaData.date()}</span>
        </td>
      );
    }),
    currentDates: currentDates.map((metaData) => {
      const isToday = isSameDate(metaData, dayjs());
      const className = getClassName(['date', { today: isToday }]);

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
        <td className={className} onMouseEnter={(e) => onMouseEnter(metaData)} onMouseLeave={(e) => onMouseLeave()}>
          <span>{metaData.date()}</span>
        </td>
      );
    }),
  } as const;
}
