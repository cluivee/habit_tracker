import React, {
  Component,
  useState,
  useEffect,
  useCallback,
  memo,
  useMemo,
} from "react";
import "./MyCalendar.css";

import {
  addMonths,
  subMonths,
  format,
  startOfWeek,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isSameDay,
  toDate,
} from "date-fns";
import { ToggleButton, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { letterSpacing } from "@mui/system";

// This is the main calendar / habit tracker component.

// These were for css variables but not used anymore
var r = document.querySelector(":root");
console.log(
  "--main-color value: " +
    document.documentElement.style.getPropertyValue("--main-color")
);

function MyCalendar({
  setCalendarDate,
  habits,
  setHabits,
  selectedHabitButtonId,
  calendarButtonBoolean,
  setCalendarButtonBoolean,
}) {
  // const buttonStyle = {
  //   backgroundColor: "#fff",
  // };
  // const otherStyle = {
  //   backgroundColor: "green",
  // };
  // const [addStyle, setAddStyle] = useState({});

  // state for the currently selected date. There is already a state for this in the parent App component, so potentially I could only have one state variable for this, but I may move the date into only the MyCalendar component in the future to prevent some rerendering issues.
  const [currentDate, setCurrentDate] = useState(new Date());


  // the currently select habit
  const selectedDict = useMemo(
    () => habits.find((dict) => dict.id === selectedHabitButtonId),
    [habits, selectedHabitButtonId]
  );

  let currentTicked = [];
    if (selectedDict) {
      console.log('currentTicked');
      currentTicked = selectedDict.ticked;
    } else {
      console.log('currentTicked not found');
      currentTicked = [];
    }


  // CalendarToggleButton component. Each of these represents one date on the calendar.
  const CalendarToggleButton = memo(
    ({ day, cloneDay, monthStart, formattedDate }) => {

      // buttonstate is not really used anymore, but I would one day want to use a state variable for each date button to toggle the color, as this would prevent some rerendering.
      const [buttonState, setButtonState] = useState(true);

      // function I got off StackOverflow to check if date object is in array
      function isInArray(array, value) {
        return !!array.find((item) => {
          return item.getTime() === value.getTime();
        });
      }

      // function to add a date to ticked array. We now sort the ticked array every time to make it easier to count the streak, but it might be better if we could just place the dates in sorted order from the start
      function addDate(id, tickedDate) {
        setHabits((currActiveDict) => {
          return currActiveDict.map((dict) => {
            if (dict.id === id) {
              return {
                ...dict,
                ticked: isInArray(dict.ticked, tickedDate)
                  ? dict.ticked.filter(
                      (item) => item.getTime() !== tickedDate.getTime()
                    )
                  : [...dict.ticked, tickedDate].sort((a, b) => {
                      return a - b;
                    }),
              };
            } else {
              return dict;
            }
          });
        });
      }

      // onClick function each date button
      const onDateClick = (dayToChange, event) => {
        addDate(selectedHabitButtonId, day);
        setCurrentDate(dayToChange);

        if (calendarButtonBoolean === false) {
          setCalendarButtonBoolean(true);
        } else {
          setCalendarButtonBoolean(false);
        }

        // if (intermediateDict.hasOwnProperty(day)) {
        //   delete intermediateDict[day];
        // } else {
        //   intermediateDict[day] = 1;
        // }

        // propSetActiveDict(intermediateDict);

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

        setButtonState(!buttonState);
        setCalendarDate(dayToChange);

        console.log("currentDate: " + currentDate);

        // console.log(
        //   getComputedStyle(document.body).getPropertyValue("--toggled-color")
        // );

        // event.target.classList.add("myClass");

        // if (document.documentElement.style.getPropertyValue("--toggled-color") === event.target.style.backgroundColor) {
        //   event.target.style.backgroundColor = "#fff"
        // } else {
        //   console.log(document.documentElement.style.getPropertyValue("--toggled-color"))
        //   event.target.style.backgroundColor = document.documentElement.style.getPropertyValue("--toggled-color")
        // }
      };

      // const theme = useTheme();

      return (
        <ToggleButton
          sx={{
            borderRadius: 0,
            height: "100%",
            border: 0,
          }}
          variant="contained"
          fullWidth
          className={`${
            !isSameMonth(day, monthStart)
              ? "toggleButtonClass disabled"
              : isSameDay(day, new Date())
              ? "toggleButtonClass today"
              : isSameDay(day, currentDate)
              ? "toggleButtonClass selected"
              : "toggleButtonClass"
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

          style={{
            backgroundColor: `${
              isInArray(currentTicked, day)
                ? // ? eval("theme.palette."+selectedDict.color+".main")
                  selectedDict.colorHex
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

  // The top header of the calendar
  const CalendarHeader = () => {
    const dateFormat = "dd MMMM yyyy";
    return (
      <div className="container">
        <div className="container col-start">
          <div className="icon" onClick={prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="container col-center">
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
  const DaysOfWeek = () => {
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

  // The Calendar Grid with the buttons of dates
  const CalendarGrid = memo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = "dd";
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      formattedDate = format(day, dateFormat);

      // ok apparently cloneDay is necessary otherwise if we just passed in 'day' into the onDateClick method it would just keep using the startDate which is at the beginning on the month
      const cloneDay = day;

      days.push(
        <div key={day}>
          <CalendarToggleButton
            key={day}
            day={day}
            cloneDay={cloneDay}
            monthStart={monthStart}
            formattedDate={formattedDate}
          />
        </div>
      );
      day = addDays(day, 1);
    }
    return days;
  });

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  return (
    <div className="calendar">
      <div>{<CalendarHeader />}</div>
      <div>{<DaysOfWeek />}</div>
      <div className="container">{<CalendarGrid />}</div>
    </div>
  );
}

// I memo'd the calendar to prevent some rerenderings, but it still rerenders more than I'd like.
export const MemoCalendar = memo(MyCalendar);

export default MyCalendar;
