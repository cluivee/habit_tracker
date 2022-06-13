import React, { Component, useState } from "react";
import "./MyCalendar.css";

import {
  addMonths,
  subMonths,
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isSameDay,
  toDate,
} from "date-fns";
import { ToggleButton } from "@mui/material";

// const MyCalendar = ({propSetCalendarDateText,}) => {
function MyCalendar({ propSetCalendarDateText }) {
 

  const buttonStyle = {
    backgroundColor: "#fff",
  };

  const otherStyle = {
    backgroundColor: "green",
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [colorToggle, setColorToggle] = useState("green");
  const [addStyle, setAddStyle] = useState({});

  

  const MyToggleButton = ({ day, cloneDay, monthStart, formattedDate }) => {
    const [buttonState, setButtonState] = useState(true);

    const onDateClick = (day, event) => {
      // setButtonState(false);
      console.log(buttonState);
      console.log(day);
      setSelectedDate(day);
      propSetCalendarDateText(selectedDate.toString());
      // event.target.classList.add("myClass");
  
      // if (document.documentElement.style.getPropertyValue("--toggled-color") === event.target.style.backgroundColor) {
      //   event.target.style.backgroundColor = "#fff"
      // } else {
      //   console.log(document.documentElement.style.getPropertyValue("--toggled-color"))
      //   event.target.style.backgroundColor = document.documentElement.style.getPropertyValue("--toggled-color")
      // }
    };

    const overClick = (day, e) => {
      onDateClick(toDate(cloneDay), e);
      setButtonState(false);
    }

    return (
      <div
        className={`column cell ${
          !isSameMonth(day, monthStart)
            ? "disabled"
            : isSameDay(day, selectedDate)
            ? "selected"
            : ""
        }`}

        // className="column cell"

        key={day}
        // style={buttonState ? buttonStyle : otherStyle}
        style={{backgroundColor: `${buttonState ? "#fff" : "pink"}`}}

        // this was in onClick : (e) => onDateClick(toDate(cloneDay), e)
        // () => setButtonState(!buttonState)
        onClick={(e) => overClick(toDate(cloneDay),e)}
        >
        <span className="number">{formattedDate}</span>
        <span className="bg">{formattedDate}</span>
      </div>
    );
  };

  const header = () => {
    const dateFormat = "MMMM yyyy";
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

  // This is the header bar for days of the week
  const days = () => {
    const dateFormat = "iii";
    const daysHeader = [];
    let startDate = startOfWeek(currentDate);
    for (let i = 0; i < 7; i++) {
      daysHeader.push(
        <div className="column col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days row">{daysHeader}</div>;
  };

  const cells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = "dd";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);

        // ok apparently cloneDay is necessary otherwise if we just passed in 'day' into the onDateClick method it would just be keep using the startDate which is at the beginning on the month
        const cloneDay = day;

        days.push(
          <MyToggleButton
            day={day}
            cloneDay={cloneDay}
            monthStart={monthStart}
            formattedDate={formattedDate}
          />
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
        {days}
        </div>
      );
      console.log("refreshing rows")
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  
  return (
    <div className="calendar">
      <div>{header()}</div>
      <div>{days()}</div>
      <div>{cells()}</div>
    </div>
  );
}

export default MyCalendar;
