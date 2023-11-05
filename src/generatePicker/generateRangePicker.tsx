import { useEffect, useMemo, useRef, useState } from 'react';
import { css, styled } from 'styled-components';
import { CgArrowLongRight } from 'react-icons/cg';
import { AiOutlineCalendar } from 'react-icons/ai';
import { getDays } from '../utils/getDays';
import { getDateInfo } from '../utils/getRangeDateInfo';

export type focusedinput = 'start' | 'end';

function generateRangePicker() {
  const RangePicker = () => {
    const [isDateRangeFocused, setIsDateRangeFocused] = useState(false);
    const [focusedinput, setFocusedinput] = useState<focusedinput>('start');
    const [startInput, setStartInput] = useState('');
    const [endInput, setEndInput] = useState('');
    const [inputRect, setInputRect] = useState<{ width: number; offsetX: number }>({ width: 0, offsetX: 0 });

    const DateRangeRef = useRef<null | HTMLDivElement>(null);
    const StartInputRef = useRef<null | HTMLInputElement>(null);
    const EndInputRef = useRef<null | HTMLInputElement>(null);

    const onReset = () => {
      setIsDateRangeFocused(false);
      setStartInput('');
      setEndInput('');
    };

    const onBlur = () => {
      const isEveryInputFilled = startInput && endInput;
      isEveryInputFilled ? setIsDateRangeFocused(false) : onReset();
    };

    const getInputRect = (): { width: number; offsetX: number } => {
      const startInputWidth = StartInputRef.current?.clientWidth ?? 0;
      const startInputOffsetX = StartInputRef.current?.offsetLeft ?? 0;
      const endInputWidth = EndInputRef.current?.clientWidth ?? 0;
      const endInputOffsetX = EndInputRef.current?.offsetLeft ?? 0;

      return focusedinput === 'start'
        ? { width: startInputWidth, offsetX: startInputOffsetX }
        : { width: endInputWidth, offsetX: endInputOffsetX };
    };

    useEffect(() => {
      setInputRect(getInputRect);
    }, [focusedinput]);

    const days = useMemo(() => getDays(), []);
    const { prevDates, currentDates, nextDates } = getDateInfo();

    return (
      <Containter>
        <DateRange
          ref={DateRangeRef}
          $isDateRangeFocused={isDateRangeFocused}
          $inputWidth={inputRect.width}
          $inputOffsetX={inputRect.offsetX}
          onClick={() => {
            StartInputRef.current?.focus();
            setFocusedinput('start');
          }}
        >
          <InputBar>
            <StartInput>
              <input
                ref={StartInputRef}
                type="text"
                autoComplete="off"
                placeholder={'Start date'}
                onFocus={() => {
                  setIsDateRangeFocused(true);
                  setFocusedinput('start');
                }}
                onBlur={onBlur}
              />
              <CgArrowLongRight />
            </StartInput>
            <EndInput>
              <input
                ref={EndInputRef}
                type="text"
                autoComplete="off"
                placeholder={'End date'}
                onClick={(e) => e.stopPropagation()}
                onFocus={() => {
                  setIsDateRangeFocused(true);
                  setFocusedinput('end');
                }}
                onBlur={onBlur}
              />
              <AiOutlineCalendar />
            </EndInput>
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
              <DataGrid>
                {days.map((day) => (
                  <div className="grid-header" key={day}>
                    {day}
                  </div>
                ))}
                {[...prevDates, ...currentDates, ...nextDates]}
              </DataGrid>
            </DateBody>
          </DatePicker>
        </DatePickerPanel>
      </Containter>
    );
  };

  return RangePicker;
}

const Containter = styled.div``;

interface DateRangeProps {
  $isDateRangeFocused: boolean;
  $inputWidth: number;
  $inputOffsetX: number;
}
const DateRange = styled.div<DateRangeProps>`
  width: 300px;
  height: 32px;
  background-color: rgb(255, 255, 255);
  border: 1.5px solid rgb(217, 217, 217);
  padding: 4px 11px;
  position: relative;
  border-radius: 6px;
  transition: border 0.2s ease-in;

  &:hover {
    border: 1.5px solid var(--point-blue);
  }

  &::before {
    content: '';
    width: ${({ $inputWidth }) => $inputWidth}px;
    height: 1px;
    background-color: var(--point-blue);
    position: absolute;
    bottom: 0;
    transition: left 0.3s ease-in-out, visibility 0.3s ease-in-out, opacity 0.3s ease-in-out;
    left: ${({ $inputOffsetX }) => $inputOffsetX}px;
    visibility: hidden;
    opacity: 0;
    ${({ $isDateRangeFocused }) =>
      $isDateRangeFocused &&
      css`
        visibility: visible;
        opacity: 1;
      `}
  }

  ${({ $isDateRangeFocused }) =>
    $isDateRangeFocused &&
    css`
      border: 1.5px solid var(--point-blue);
      outline: 2px solid var(--point-sky);
    `}
`;

const InputBar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StartInput = styled.div`
  display: flex;

  & > input {
    width: 100%;
    border: none;
    color: rgba(0, 0, 0, 0.88);
    background-color: transparent;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, segoe ui, Roboto, helvetica neue, Arial, noto sans, sans-serif,
      apple color emoji, segoe ui emoji, segoe ui symbol, noto color emoji;
    transform: translateY(-1.5px);

    &:focus {
      outline: none;
    }

    &::-webkit-input-placeholder {
      font-size: inherit;
      color: #cacaca;
      font-family: inherit;
    }
  }

  & svg {
    font-size: 25px;
    color: #cacaca;
  }
`;
const EndInput = styled(StartInput)``;

const DatePickerPanel = styled.div`
  height: 309px;
  display: flex;
`;
const DatePicker = styled.div`
  width: 288px;
  height: 100%;
`;
const DateHeader = styled.div`
  display: flex;
  height: 40px;
  padding: 0 19px;

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
  padding: 8px 18px;
`;

const DataGrid = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(7, 1fr);
  grid-row-gap: 10px;

  & .grid-header,
  .date {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  & .grid-header {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  & .date {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;

    & > span {
      display: inline-flex;
      width: 24px;
      height: 24px;
      border-radius: 5px;
      justify-content: center;
      align-items: center;
    }

    &.today {
      & > span:before {
        content: '';
        position: absolute;
        width: inherit;
        height: inherit;
        box-shadow: 0 0 0 1.5px #88b8ff;
        border-radius: 5px;
      }
    }

    &.extra-date {
      color: rgba(0, 0, 0, 0.25);
    }

    &.disabled-date {
      cursor: initial;
      background-color: rgba(0, 0, 0, 0.04);

      & > span {
        color: rgba(0, 0, 0, 0.25);
      }

      &:hover {
        & > span {
          transition: initial;
          background-color: initial;
        }
      }

      &.today > span:before {
        display: none;
      }
    }

    &.selected-date {
    }

    &:hover {
      & span {
        transition: background-color 0.2s ease-in-out;
        background-color: rgba(0, 0, 0, 0.06);
      }
    }
  }
`;

export default generateRangePicker;
