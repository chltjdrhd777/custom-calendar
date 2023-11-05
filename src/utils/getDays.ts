import dayjs from 'dayjs';

export const getDays = () => {
  const days = [];

  for (let i = 0; i < 7; i++) {
    const day = dayjs().day(i).format('dd');
    days.push(day);
  }

  return days;
};
