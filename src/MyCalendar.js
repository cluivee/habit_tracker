import React, {
  Component,
  useState,
  useEffect,
  useCallback,
  memo,
} from "react";

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
import { ToggleButton, Button } from "@mui/material";

var r = document.querySelector(":root");

console.log(
  "--main-color value: " +
    document.documentElement.style.getPropertyValue("--main-color")
);

// const MyCalendar = ({propSetCalendarDateText,}) => {
function MyCalendar({
  propSetCalendarDate,
  propSetActiveDict,
  propCurrentColor,
  propActiveDict,
  propSetOrigDict,
  propSetBlueDict,
  propSetPurpleDict,
  propCurrentDict,
}) {
  const buttonStyle = {
    backgroundColor: "#fff",
  };

  const otherStyle = {
    backgroundColor: "green",
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [addStyle, setAddStyle] = useState({});

  let intermediateDict = { ...propActiveDict };

  // MyToggleButton component
  
  const MyToggleButton = memo(
    ({
      day,
      cloneDay,
      monthStart,
      formattedDate,
      propSetClickedDay,
      propClickedDay,
    }) => {
      const [buttonState, setButtonState] = useState(true);

      // date we have most recently clicked on
      const [selectedDate, setSelectedDate] = useState(new Date());

      // I'm using useEffect but actually it's not necessary at this point after I memo'd MyCalendar. I could just call
      // propSetCalendarDateText in the onClick method and it would still work
      useEffect(() => {
        propSetCalendarDate(selectedDate);
      }, [selectedDate, propClickedDay]);

      const onDateClick = (dayToChange, event) => {
        if (intermediateDict.hasOwnProperty(day)) {
          delete intermediateDict[day];
        } else {
          intermediateDict[day] = 1;
        }

        propSetActiveDict(intermediateDict);

        // if (intermediateDict.currentColor.indexOf(day) > -1) {
        //   intermediateDict.currentColor.splice(
        //     intermediateDict.currentColor.indexOf(day)
        //   );
        //   console.log("deleted");
        // } else {
        //   if (daysArray.indexOf(day) === -1) {
        //     daysArray.push(day);

        //   }
        //   intermediateDict[currentColor] = daysArray;
        // }
        console.log(intermediateDict);

        setButtonState(!buttonState);

        propSetClickedDay(dayToChange);

        console.log("clickedDay: " + propClickedDay);
        console.log("cloneDay: " + cloneDay);
        console.log("currentDate: " + currentDate);

        setSelectedDate(dayToChange);

        console.log(selectedDate);
        // console.log(
        //   getComputedStyle(document.body).getPropertyValue("--toggled-color")
        // );

        // propSetCalendarDateText(selectedDate.toString());
        // event.target.classList.add("myClass");

        // if (document.documentElement.style.getPropertyValue("--toggled-color") === event.target.style.backgroundColor) {
        //   event.target.style.backgroundColor = "#fff"
        // } else {
        //   console.log(document.documentElement.style.getPropertyValue("--toggled-color"))
        //   event.target.style.backgroundColor = document.documentElement.style.getPropertyValue("--toggled-color")
        // }
      };

      return (
        <ToggleButton
          sx={{ borderRadius: 0, height: "100%" }}
          variant="contained"
          fullWidth
          className={`${
            !isSameMonth(day, monthStart)
              ? "disabled"
              : isSameDay(day, currentDate)
              ? "selected"
              : ""
          }`}
          // Using id to override the borders in the MUIButtonBase root
          id={`${
            !isSameMonth(day, monthStart)
              ? "disabledID"
              : isSameDay(day, currentDate)
              ? "selectedID"
              : ""
          }`}
          key={day}
          // originally doing it by changing a custom style
          // style={buttonState ? buttonStyle : otherStyle}

          // then doing it based off a boolean state value
          // style={{
          //   backgroundColor: `${
          //     buttonState
          //       ? "#fff"
          //       : getComputedStyle(document.body).getPropertyValue(
          //           "--toggled-color"
          //         )
          //   }`,

          // now doing it based on if it exists in the dict or not
          style={{
            backgroundColor: `${
              propActiveDict.hasOwnProperty(day)
                ? "pink"
                : getComputedStyle(document.body).getPropertyValue(
                    "--toggled-color"
                  )
            }`,
            borderColor: `${buttonState ? "#pink" : "red"}`,
          }}
          // this was in onClick : (e) => onDateClick(toDate(cloneDay), e)
          // () => setButtonState(!buttonState)
          onClick={(e) => onDateClick(toDate(cloneDay), e)}
        >
          <span className="number">{formattedDate}</span>
          <span className="bg">{formattedDate}</span>
        </ToggleButton>
      );
    }
  );

  const header = () => {
    const dateFormat = "dd MMMM yyyy";
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
        <div className="days-headings" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="container">{daysHeader}</div>;
  };

  const Cells = memo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = "dd";
    let days = [];
    let day = startDate;
    let formattedDate = "";

    const [clickedDay, setClickedDay] = useState(new Date());

    while (day <= endDate) {
      formattedDate = format(day, dateFormat);

      // ok apparently cloneDay is necessary otherwise if we just passed in 'day' into the onDateClick method it would just be keep using the startDate which is at the beginning on the month
      const cloneDay = day;

      days.push(
        <div key={day}>
          <MyToggleButton
            day={day}
            key={day}
            cloneDay={cloneDay}
            monthStart={monthStart}
            formattedDate={formattedDate}
            propSetClickedDay={setClickedDay}
            propClickedDay={clickedDay}
          />
        </div>
      );
      day = addDays(day, 1);
    }
    // propSetDatesArray(intermediateArray);
    return days;
  });

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // buttonList Grid example
  const something = "100%";
  let newCount = 1;
  let years = Array(31)
    .fill()
    .map(() => newCount++);

  let buttonList = years.map((year, index) => {
    return (
      <div>
        <Button fullWidth style={{ height: something }} variant="contained">
          {year}
        </Button>
      </div>
    );
  });

  return (
    <div className="calendar">
      <div>{header()}</div>
      <div>{days()}</div>
      <div className="container">{<MyToggleButton />}</div>
      <div className="container" 
        // style={{ marginTop: "20px" }}
      >
        {buttonList}
      </div>
    </div>
  );
}

export const MemoCalendar = memo(MyCalendar);

export default MyCalendar;
