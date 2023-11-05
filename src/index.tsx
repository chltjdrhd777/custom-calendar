import React from 'react';
import ReactDOM from 'react-dom/client';
import DatePicker from './DatePicker';

const { SinglePicker, RangePicker } = DatePicker;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <SinglePicker />
  </React.StrictMode>,
);
