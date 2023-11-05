import { useEffect, useMemo, useRef, useState } from 'react';
import { css, styled } from 'styled-components';
import { AiOutlineCalendar, AiFillCloseCircle } from 'react-icons/ai';
import { getDays } from '../utils/getDays';
import { getSignleDateInfo } from '../utils/getSingleDateInfo';
import dayjs from 'dayjs';
import { getDates } from '../utils/getDates';
import { useHandleClickOutside } from '../hook/useHandleClickOutside';

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
    const [rangeInputIcon, setRangeInputIcon] = useState<'calendar' | 'clear'>('calendar');

    const DateRangeRef = useRef<null | HTMLDivElement>(null);
    const InputRef = useRef<null | HTMLInputElement>(null);
    const ContainerRef = useRef<null | HTMLDivElement>(null);

    const { prevDates, currentDates, nextDates } = getSignleDateInfo({
      targetTime,
      setTargetTime,
      setInputValue,
      selectedValue,
      setSelectedValue,
      setIsInputFocused,
    });

    const days = useMemo(() => getDays(), []);
    const dates = useMemo(() => getDates({ prevDates, currentDates, nextDates }), [prevDates, currentDates, nextDates]);
    const headerView = (locale?: string) => {
      const month = dayjs().month(targetTime.month()).format('MMM');
      const year = targetTime.year();
      return (
        <>
          <span>{month}</span>
          <span>{year}</span>
        </>
      );
    };

    const getDefaultValue = () => {
      const valueList = [inputValue.year, inputValue.month, inputValue.date];
      return valueList.includes('') ? '' : `${inputValue.year}-${inputValue.month}-${inputValue.date}`;
    };

    useEffect(() => {
      // if (inputValue.year || inputValue.month || inputValue.date) {
      //   InputRef.current?.focus();
      // }
    }, [inputValue]);

    useHandleClickOutside(ContainerRef, () => {
      InputRef.current?.blur();
      setIsInputFocused(false);
    });

    return (
      <Containter ref={ContainerRef}>
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
              />

              <RangeInputIcon
                className="input-icon"
                rangeInputIcon={rangeInputIcon}
                onMouseEnter={() => {
                  selectedValue ? setRangeInputIcon('clear') : setRangeInputIcon('calendar');
                }}
                onMouseLeave={() => {
                  setRangeInputIcon('calendar');
                }}
              >
                <AiOutlineCalendar className="calendar" />
                <AiFillCloseCircle
                  className="clear"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedValue('');
                    setInputValue((prev) => ({ ...prev, date: '' }));
                  }}
                />
              </RangeInputIcon>
            </DateInput>
          </InputBar>
        </DateRange>

        <DatePickerPanel isInputFocused={isInputFocused}>
          <DatePicker>
            <DateHeader>
              <button className="super-prev-btn" onClick={() => setTargetTime((prev) => prev.subtract(1, 'year'))} />
              <button className="prev-btn" onClick={() => setTargetTime((prev) => prev.subtract(1, 'month'))} />
              <div className="header-view">{headerView()}</div>
              <button className="next-btn" onClick={() => setTargetTime((prev) => prev.add(1, 'month'))} />
              <button className="super-next-btn" onClick={() => setTargetTime((prev) => prev.add(1, 'year'))} />
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

const Containter = styled.div`
  position: relative;
  display: inline-block;
`;

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

  /* & .input-icon {
    position: relative;
    width: 14px;
    height: 14px;
    & svg {
      position: absolute;
      font-size: 18px;
      color: #cacaca;
      transition: all 0.5s ease;

      &.calendar {
        visibility: visible;
        opacity: 1;
      }

      &.clear {
        visibility: hidden;
        opacity: 0;
        &:hover {
          color: #747474;
        }
      }

      &.calendar.show,
      &.clear.show {
        visibility: visible;
        opacity: 1;
      }

      &.calender.hide,
      &.clear.hide {
        visibility: hidden;
        opacity: 0;
      }
    }
  } */
`;

interface RangeInputIconProps {
  rangeInputIcon: 'calendar' | 'clear';
}
const RangeInputIcon = styled.span<RangeInputIconProps>`
  position: relative;
  width: 14px;
  height: 14px;
  & svg {
    position: absolute;
    font-size: 18px;
    color: #cacaca;
    transition: all 0.5s ease;

    &.calendar {
      visibility: visible;
      opacity: 1;
    }

    &.clear {
      cursor: pointer;
      visibility: hidden;
      opacity: 0;
      &:hover {
        color: #747474;
      }
    }
  }

  ${({ rangeInputIcon }) =>
    rangeInputIcon === 'calendar'
      ? css`
          & svg.calendar {
            visibility: visible;
            opacity: 1;
          }

          & svg.clear {
            visibility: hidden;
            opacity: 0;
          }
        `
      : css`
          & svg.calendar {
            visibility: hidden;
            opacity: 0;
          }
          & svg.clear {
            visibility: visible;
            opacity: 1;
          }
        `}
`;

interface DatePickerPanelProps {
  isInputFocused: boolean;
}
const DatePickerPanel = styled.div<DatePickerPanelProps>`
  height: 309px;
  width: 288px;
  display: flex;
  border-radius: 8px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  margin: 5px 0;

  position: absolute;
  left: 0;
  transform-origin: top left;

  visibility: ${({ isInputFocused }) => (isInputFocused ? 'visible' : 'hidden')};

  @keyframes dropdown {
    0% {
      opacity: 0;
      visibility: hidden;
      transform: scaleY(0%);
    }
    30% {
      opacity: 0.5;
      transform: scaleY(100%);
    }
    100% {
      opacity: 1;
      transform: scaleY(100%);
    }
  }
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
          padding: 5px;

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

          &.selectedDate {
            & span {
              background-color: var(--point-blue);
              color: white;
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
