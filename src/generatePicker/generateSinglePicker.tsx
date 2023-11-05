import { useEffect, useMemo, useRef, useState } from 'react';
import { css, styled } from 'styled-components';
import { AiOutlineCalendar } from 'react-icons/ai';
import { getDays } from '../utils/getDays';
import { getSignleDateInfo } from '../utils/getSingleDateInfo';
import dayjs from 'dayjs';

function generateSignlePicker() {
  const SinglePicker = () => {
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [targetTime, setTargetTime] = useState(dayjs());
    const [selectedValue, setSelectedValue] = useState('');
    const [inputValue, setInputValue] = useState({
      decade: String(targetTime.year()),
      year: '',
      month: '',
      date: '',
    });

    const DateRangeRef = useRef<null | HTMLDivElement>(null);
    const InputRef = useRef<null | HTMLInputElement>(null);
    const { prevDates, currentDates, nextDates } = getSignleDateInfo({
      targetTime,
      setInputValue,
    });

    const days = useMemo(() => getDays(), []);
    const dates = useMemo(() => {
      const rows = [];
      const mergedDates = [...prevDates, ...currentDates, ...nextDates];

      for (let i = 0; i < mergedDates.length; i += 7) {
        const slice = mergedDates.slice(i, i + 7);

        rows.push(<tr key={i}>{slice}</tr>);
      }
      return rows;
    }, []);

    const getDefaultValue = () => {
      const valueList = [inputValue.year, inputValue.month, inputValue.date];
      return valueList.includes('') ? '' : `${inputValue.year}-${inputValue.month}-${inputValue.date}`;
    };

    useEffect(() => {
      if (inputValue.year || inputValue.month || inputValue.date) {
        InputRef.current?.focus();
      }
    }, [inputValue]);

    return (
      <Containter>
        <DateRange
          ref={DateRangeRef}
          onClick={() => {
            InputRef.current?.focus();
          }}
          isInputFocused={isInputFocused}
        >
          <InputBar>
            <DateInput selectedValue={selectedValue}>
              <input
                ref={InputRef}
                type="text"
                autoComplete="off"
                placeholder={'Select date'}
                key={inputValue.year + inputValue.month + inputValue.date}
                defaultValue={getDefaultValue()}
                onFocus={() => {
                  setIsInputFocused(true);
                }}
                onBlur={() => {
                  setIsInputFocused(false);
                }}
              />
              <AiOutlineCalendar />
            </DateInput>
          </InputBar>
        </DateRange>

        <DatePickerPanel>
          <DatePicker>
            <DateHeader>
              <button className="super-prev-btn"></button>
              <button className="prev-btn"></button>
              <div className="header-view">
                <span>Nov</span>
                <span>2023</span>
              </div>
              <button className="next-btn"></button>
              <button className="super-next-btn"></button>
            </DateHeader>
            <DateBody>
              <table>
                <thead>
                  <tr>
                    {days.map((day) => (
                      <th key={day}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>{dates}</tbody>
              </table>
            </DateBody>
          </DatePicker>
        </DatePickerPanel>
      </Containter>
    );
  };

  return SinglePicker;
}

const Containter = styled.div``;

interface DateRangeProps {
  isInputFocused: boolean;
}
const DateRange = styled.div<DateRangeProps>`
  width: 140px;
  height: 32px;
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(217, 217, 217);
  padding: 3px 10px;
  position: relative;
  border-radius: 6px;
  transition: border 0.2s ease-in, box-shadow 0.2s ease-in;

  &:hover {
    border-color: var(--point-blue);
  }

  ${({ isInputFocused }) =>
    isInputFocused &&
    css`
      border-color: var(--point-blue);
      box-shadow: 0 0 0 2px var(--point-sky);
    `}
`;

const InputBar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

interface DateInputProps {
  selectedValue: string;
}
const DateInput = styled.div<DateInputProps>`
  display: flex;

  & > input {
    width: 100%;
    height: 100%;
    border: none;
    color: ${({ selectedValue }) => (selectedValue ? 'rgba(0, 0, 0, 0.88)' : '#9c9c9c')};
    background-color: transparent;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, segoe ui, Roboto, helvetica neue, Arial, noto sans, sans-serif,
      apple color emoji, segoe ui emoji, segoe ui symbol, noto color emoji;
    transform: translateY(-1px);

    &:focus {
      outline: none;
    }

    &::-webkit-input-placeholder {
      font-size: inherit;
      font-family: inherit;
      color: #cacaca;
    }
  }

  & svg {
    font-size: 18px;
    color: #cacaca;
  }
`;

const DatePickerPanel = styled.div`
  height: 309px;
  width: 288px;
  display: flex;
  border-radius: 8px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
`;
const DatePicker = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const DateHeader = styled.div`
  display: flex;
  height: 40px;
  padding: 0 19px;
  border-bottom: 1px solid rgba(5, 5, 5, 0.06);

  & button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &::before {
      content: '';
      width: 5px;
      height: 5px;
      border-top: 1.5px solid #959595;
      border-right: 1.5px solid #959595;
      transform: rotate(225deg);
      position: absolute;
    }

    &[class*='next'] {
      &::before {
        transform: rotate(45deg);
      }
    }

    &[class^='super'] {
      &::after {
        content: '';
        position: absolute;
        width: 5px;
        height: 5px;
        border-top: 1.5px solid #959595;
        border-right: 1.5px solid #959595;
        transform: rotate(225deg);
      }

      &[class*='prev']::after {
        right: 8px;
      }

      &[class*='next']::after {
        left: 8px;
        transform: rotate(45deg);
      }
    }

    &:hover::before,
    &:hover::after {
      transition: border-color 0.15s ease-in;
      border-top-color: #303030;
      border-right-color: #303030;
    }
  }

  & .header-view {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 14px;
    gap: 7px;

    & span {
      cursor: pointer;
      &:hover {
        transition: color 0.15s ease-in;
        color: var(--point-blue);
      }
    }
  }
`;

const DateBody = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px 18px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  & table {
    width: 100%;
    height: 100%;
    color: rgba(0, 0, 0, 0.88);
    font-size: 14px;
    font-weight: 500;
    border-collapse: collapse;

    & th,
    td {
      padding: 0;
    }

    & thead {
      & tr {
        th {
          width: 36px;
          height: 36px;
          color: inherit;
          font-weight: inherit;
        }
      }
    }

    & tbody {
      width: 100%;
      height: 100%;

      & tr {
        td {
          cursor: pointer;
          text-align: center;
          padding: 8px;

          & > span {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            position: relative;
          }

          &:hover > span {
            transition: background-color 0.1s ease-in;
            background-color: rgba(0, 0, 0, 0.04);
          }

          &.today {
            & span:before {
              content: '';
              position: absolute;
              width: inherit;
              height: inherit;
              box-shadow: 0 0 0 1px var(--point-blue);
              border-radius: 5px;
            }
          }

          &.extra-date {
            color: rgba(0, 0, 0, 0.25);
          }
        }
      }
    }
  }
`;

export default generateSignlePicker;
