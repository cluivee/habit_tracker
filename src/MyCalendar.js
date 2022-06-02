import React, { useState } from "react";
import { addMonths, subMonths, format } from 'date-fns'
import "./MyCalendar.css";

const MyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const nextMonth = () => {
      setCurrentDate(addMonths(currentDate, 1));
  }

  const prevMonth = () => {
      setCurrentDate(subMonths(currentDate, 1));
  }

  const header = () => {
    const dateFormat = "mmmm yyyy";

    return (
      <div className="header row flex-middle">
        <div className="column col-start">
          <div className="icon" onClick={prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="column col-center">
          <span>{format(currentDate, dateFormat)}</span>
        </div>
        <div className="column col-end">
          <div className="icon" onClick={nextMonth}>
            chevron_right
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="myCalendar">
      <div> {header()}</div>
      {/* <div> {daysOfWeek()}</div>
      <div> {cells()}</div> */}
      <h1>Calendar</h1>
      hello, this is the calendar component
    </div>
  );
};

export default MyCalendar;
