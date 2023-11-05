import generateRangePicker from './generatePicker/generateRangePicker';
import './DatePicker.css';
import generateSignlePicker from './generatePicker/generateSinglePicker';

export interface defaultProps {
  picker?: 'week' | 'month' | 'quanter' | 'year';
}

function generatePickers() {
  const RangePicker = generateRangePicker();
  const SinglePicker = generateSignlePicker();

  const MergedDatePicker = {
    SinglePicker,
    RangePicker,
  };

  return MergedDatePicker;
}

const DatePicker = generatePickers();

export default DatePicker;
