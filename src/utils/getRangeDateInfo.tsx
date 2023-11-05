import dayjs from 'dayjs';

interface GetDateInfoParams {
  targetTime?: string;
  selectedDate?: dayjs.Dayjs;
}

export function getDateInfo(targetTime?: string) {
  const now = dayjs(targetTime);
  const prevMonth = now.subtract(1, 'month').endOf('month');
  const currentMonth = now.date(1);
  const nextMonth = now.add(1, 'month').date(1);

  const prevLastDay = prevMonth.day();
  const currentLastDate = now.endOf('month').date();
  const currentLastDay = now.endOf('month').day();

  const prevDates: dayjs.Dayjs[] = [];
  const currentDates = Array(currentLastDate)
    .fill(null)
    .map((_, i) => currentMonth.add(i, 'day'));
  const nextDates: dayjs.Dayjs[] = [];

  const calculatePrevDates = (prevDates: dayjs.Dayjs[]) => {
    if (prevLastDay !== 6) {
      for (let i = 0; i < prevLastDay + 1; i++) {
        prevDates.unshift(prevMonth.subtract(i, 'day'));
      }
    }
  };
  const calculateNextDates = (nextDates: dayjs.Dayjs[]) => {
    for (let i = 0; i < 6 - currentLastDay; i++) {
      nextDates.push(nextMonth.add(i, 'day'));
    }
  };
  const calculateRestDates = (mergedDates: dayjs.Dayjs[]) => {
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
  calculateNextDates(nextDates);
  const mergedDates = [...prevDates, ...currentDates, ...nextDates];
  calculateRestDates(mergedDates);

  const selectedStartDate = dayjs('2023-11-01');

  return {
    prevDates: prevDates.map((metaDate) => {
      const diff = metaDate.diff(selectedStartDate);

      return (
        <div className={`date extra-date ${diff < 0 && 'disabled-date'}`}>
          <span>{metaDate.date()}</span>
        </div>
      );
    }),
    currentDates: currentDates.map((metaDate) => {
      const diff = metaDate.diff(selectedStartDate);
      const isToday = isSameDate(metaDate, now);
      const isSelectedDate = isSameDate(metaDate, selectedStartDate);
      return (
        <div
          className={`date ${isToday && 'today'} ${isSelectedDate && 'selected-date'} ${diff < 0 && 'disabled-date'}`}
        >
          <span>{metaDate.date()}</span>
        </div>
      );
    }),
    nextDates: nextDates.map((metaDate) => (
      <div className="date extra-date">
        <span>{metaDate.date()}</span>
      </div>
    )),
  };
}
