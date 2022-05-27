import React, { useEffect, useState } from "react";
// import Calendar from './Calendar'
import Sidebar from "./Sidebar";
import "./App.css";
import Calendar from "react-calendar";
// import 'react-calendar/dist/Calendar.css';

const App = () => {
  const [habits, setHabits] = useState([]);
  // setHabits takes the json element of json habits databse, puts it into our new array which we've called habits
  // lookup useeffect, has 2 arguments, the first here is just an inline func li wrote, second is what to watch for to call funciton again (dependency array)
  useEffect(() => {
    fetch("http://localhost:3000/habits")
      .then((response) => response.json())
      .then((habits) => {
        console.log("Success:", habits);
        setHabits(habits);
      });
  }, []); // Empty array means nothing to watch, so only runs once

  const [date, setDate] = useState(new Date());

  const [buttonColor, setColor] = useState("yellow");
  const [borders, setBorders] = useState("black");
  const [check, setCheck] = useState(true);

  const d = new Date(2018, 11, 24, 10, 33, 30, 0);

  function isSameDay(a, b) {
    return a.getTime() === b.getTime();
  }

  function changeButtonColors() {
    if (check == true) {
      setColor("black");
      setCheck(false);
      setBorders("#0ACF83");
    } else {
      setColor("yellow");
      setCheck(true);
      setBorders("black");
    }
  }
  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  const datesToAddClassTo = [date, date.addDays(1)];

  function functileClassName({ date, view }) {
    // Add class to tiles in month view only
    if (view === "month") {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (datesToAddClassTo.find((dDate) => isSameDay(dDate, date))) {
        return "react-calendar__newtile";
      }
    }
  }

  // some nonsense tests
  // function dateMethod() {
  //  setDate();
  //  console.log(date);
  // }

  // dateMethod();

  return (
    <div className="App">
      <h1 className="text-center">React Calendar with Range</h1>

      <Sidebar habits={habits} />

      <button
        style={{
          background: buttonColor,
          color: "red",
          height: "100px",
          width: "200px",
          border: "5px solid",
          borderColor: borders,
        }}
        className="btn btn-primary"
        onClick={changeButtonColors}
      >
        Click here
      </button>

      <p className="text-center">
        <span className="bold">Print: </span>
        {date.toDateString()}
      </p>

      <button
        id="todayButton"
        onClick = {() => setDate(d)}
        style={{
          background: "white",
          fontSize: "30px",
          color: "green",
          height: "60px",
          width: "200px",
        }}
        className="btn btn-primary"
      >
        Today Button
      </button>

      <div className="calendar-container">
        <Calendar
          onChange={setDate}
          value={date}
          tileClassName={functileClassName}
          // selectRange={true}
          // defaultValue={date}
          showFixedNumberOfWeeks={true}
          activeStartDate={date}
        />
      </div>

      {/* This is the text for the selected date at the bottom  */}

      {date.length > 0 ? (
        <p className="text-center">
          <span className="bold">Start:</span> {date[0].toDateString()}
          &nbsp;|&nbsp;
          <span className="bold">End:</span> {date[1].toDateString()}
        </p>
      ) : (
        <p className="text-center">
          <span className="bold">Default selected date:</span>{" "}
          {date.toDateString()}
        </p>
      )}
    </div>
  );
};

export default App;

/*
Notes on React Habit Tracker Project

Thinking in React
1. Break UI into a component hierarchy
- Single Responsibility principle, each component ideally does only one thing
- If displaying a JSON data model to user, the component structure will often map nicely
2. Build a static version in React
- Build a version of your app that takes the data model and renders the UI but has no interactivity
- Don't use state at all here
3. Identify the minimal representation of UI State
- Ask three questions about each piece of data
a) Is it passed in from a parent via props? If so, it probably isn’t state.
b) Does it remain unchanged over time? If so, it probably isn’t state.
c) Can you compute it based on any other state or props in your component? If so, it isn’t state.
4. Identify where your state should live
- To identify which component mutates, or owns, each piece of state:
a) Identify every component that renders something based on that state.
b) Find a common owner component (a single component above all the components that need the state in the hierarchy).
c) Either the common owner or another component higher up in the hierarchy should own the state.
d) If you can’t find a component where it makes sense to own the state, create a new component solely for holding the state and add it somewhere in the hierarchy above the common owner component.
5. Add Inverse Data Flow
- The form components deep in the hierarchy now have to update the state in FilterableProductTable.

Talking to Li
React 80%
Using react, can use test dummy backend (json server), would not work for real users: 5%
Don’t have to use redux
don’t have to use typescript
dont have to use next.js
materialui for design components, so no need for bootstrap 5%
Jest for testing 10%

https://github.com/typicode/json-server

For real users - backend, can use postgresSQL, express, (knex, framework for ORM with express, can be easier), set up database connection, then other than that making queries with knex. 

Stick with official react docs
Learn react, learn hooks, usestate,useeffect
learn react, understand what components I will build, what data will flow through the components and how, where you keep state and API requests

Break down into chucks
- Make front end in react
- make calendar
- make buttons that are clickable
- save the state of buttons
- save the database of the days that have been clicked
- have lots of colours on one square
- sidebar of habits
- save preferences
- logins
- count streak
- make it look good/ material ui

TODO 24.05.2022:
- We can do the css at the end, let's get the buttons working first
- for the css:
- get the border sorted, as in the difference between borders between buttons and the ones at the edge
- sort out the height as a percentage of the screen height, so it's the right size, and we also get squares

26.05.2022:
- How is setdate updating the date? We don't even pass the date into it? Can we just pass anything into setdate? Like potatoes?

*/
