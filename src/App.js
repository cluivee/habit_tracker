import React, { useEffect, useState, useCallback } from "react";
import {MyCalendar, MemoCalendar} from './MyCalendar'
import Sidebar from "./Sidebar";
import "./App.css";
import Calendar from "react-calendar";
// import 'react-calendar/dist/Calendar.css';
import SimpleHTMLSidebarTest from "./SimpleHTMLSidebarTest";
import Button from "@mui/material/Button";
import MuiSidebar from "./MuiSidebar";
import ExampleChild from "./ExampleChild";

// below are imports for mui drawer
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

import { ThemeProvider, createTheme } from "@mui/material/styles";

// Imports for mui dynamic css slider
import { alpha, styled } from "@mui/material/styles";
import Slider from "@mui/material/Slider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

var r = document.querySelector(':root');

const darkTheme = createTheme({
  palette: {
    // I can change this to light to change the theme
    mode: "dark",
    myColor: {
      main: "#ffa726",
      contrastText: "#fff",
    },
    myOtherColor: {
      main: "#3700B3",
      contrastText: "#fff",
    },
  },
});

const drawerWidth = 240;

// DynamicCSS styledSlider test

const StyledSlider = styled(Slider, {
  shouldForwardProp: (prop) => prop !== "propParentInfo",
})(({ propParentInfo, theme }) => ({
  width: 300,
  ...(propParentInfo && { color: theme.palette.warning.main }),
}));

function DynamicCSS() {
  const [success, setSuccess] = useState(false);
  const handleChange = (event) => {
    console.log(event.target);
    console.log("Then checked is: " + event.target.checked);
    setSuccess(event.target.checked);
  };

  return (
    <React.Fragment>
      <FormControlLabel
        control={
          <Switch
            checked={success}
            onChange={handleChange}
            color="primary"
            value="dynamic-class-name"
          />
        }
        label="Success"
      />
      <StyledSlider success={success} defaultValue={30} sx={{ mt: 1 }} />
    </React.Fragment>
  );
}

const AnotherExampleButton = () => {
  const [buttonColor, setColor] = useState("#2764BA");

  function changeButtonColors() {
    buttonColor === "#2764BA" ? setColor("#eb31b3") : setColor("#2764BA");
    // This is the second way of setting css variables in the :root, using querySelector
    r.style.setProperty('--second-color', buttonColor);
  }
  return (
    <div>
      <button className="exampleButton" onClick={changeButtonColors}>
        Second Button
      </button>
    </div>
  );
};

const BorderTestButton = () => {
  const [check, setCheck] = useState(true);
  const [buttonColor, setColor] = useState("yellow");
  const [borders, setBorders] = useState("black");

  function changeButtonColors() {
    if (check === true) {
      setColor("black");
      setCheck(false);
      setBorders("#0ACF83");
    } else {
      setColor("yellow");
      setCheck(true);
      setBorders("black");
    }
  }
  return (
    <button
      style={{
        background: buttonColor,
        color: "newColor",
        height: "100px",
        width: "200px",
        border: "5px solid",
        borderColor: borders,
      }}
      onClick={changeButtonColors}
    >
      Click here
    </button>
  );
};

// This example from SO shows how to use useEffect to track the initial State and update change the text back after a timeout, though useEffect isn't actually required and I could just call setTimeout directly, which also worked.

const FancyButton = () => {
  const initialState = "Next";
  const [buttonText, setButtonText] = useState("Next");
  //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState

  // the effect
  useEffect(() => {
    if (buttonText !== initialState) {
      setTimeout(() => setButtonText(initialState), [1000]);
    }
  }, [buttonText]);

  const changeText = (text) => setButtonText(text);

  return (
    <button type="button" onClick={() => changeText("newText")}>
      {buttonText}
    </button>
  );
};

const JustMUIDrawer = ({
  propSetParentInfo,
  propParentInfo,
  propCount,
  parentCallback,
}) => {
  const [btnColor, setBtnColor] = useState("myColor");
  const [buttonText, setButtonText] = useState("Not Selected");
  const [button2Text, setButton2Text] = useState("Not Selected");
  const [cssColor, setCSSColor] = useState("#1affa0");
  const [colorToggle, setColorToggle] = useState(false);

  function childHandleChange(e) {
    console.log(e.target.value);
    this.props.onHandleChange(e.target.value);
  }

// Eventually I've stopped wondering why changing the css variable --main-color which sets the border color of the active tile, whites out the border onClick. The border is actually set in a hover state which may be messing it up somehow
  const handleClick = (event) => {
    cssColor === "#1affa0" ? setCSSColor("#eb31b3") : setCSSColor("#1affa0");
    buttonText === "Selected" ? setButtonText("Not Selected") : setButtonText("Selected")
    document.documentElement.style.setProperty("--main-color", cssColor);
    document.documentElement.style.setProperty("--toggled-color", "blue");
    console.log(
      "--main-color value: " +
        document.documentElement.style.getPropertyValue("--main-color")
    );
    console.log(cssColor);
    propParentInfo ? propSetParentInfo(false) : propSetParentInfo(true);

  };

  const handle2Click = (event) => {
    cssColor === "#1affa0" ? setCSSColor("#eb31b3") : setCSSColor("#1affa0");
    button2Text === "Selected" ? setButton2Text("Not Selected") : setButton2Text("Selected")
    document.documentElement.style.setProperty("--main-color", cssColor);
    document.documentElement.style.setProperty("--toggled-color", "purple");
    console.log(
      "--main-color value: " +
        document.documentElement.style.getPropertyValue("--main-color")
    );
    console.log(cssColor);
    propParentInfo ? propSetParentInfo(false) : propSetParentInfo(true);

  };
  return (
    <Drawer
      sx={{
        // possible to change this to a percentage
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Divider />
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
        {/* MUI button tutorial */}

        <Button
          variant="outlined"
          color="primary"
          fullWidth
          size="large"
          style={{
            maxHeight: "30px",
            minHeight: "60px",
          }}
          // onClick={() => {
          //   btnColor === "myColor" ? setBtnColor("myOtherColor") : setBtnColor("myColor");
          //   buttonText === "Hello World"
          //     ? setButtonText("Purple Active")
          //     : setButtonText("Hello World");
          // }}
          onClick={handleClick}
        >
          {buttonText}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          size="large"
          style={{
            maxHeight: "30px",
            minHeight: "60px",
          }}
          onClick={handle2Click}
        >
          {button2Text}
        </Button>
        <Counter parentCallback={parentCallback} />
      </List>
    </Drawer>
  );
};

const Counter = ({ parentCallback }) => {
  const [count, setCount] = useState(0);

  return (
    <button
      style={{ margin: "10px" }}
      onClick={() => {
        setCount((count) => count + 1);
        parentCallback(count + 1);
      }}
    >
      Click to increment
    </button>
  );
};

const TheCalendarContainer = () => {
  const [date, setDate] = useState(new Date());

  const d = new Date(2018, 11, 24, 10, 33, 30, 0);

  function isSameDay(a, b) {
    return a.getTime() === b.getTime();
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

  return (
    <div className="calendar-container">
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

      <Calendar
        onChange={setDate}
        // onClickDay= {() => alert('New date pot is: ' + date)}
        value={date}
        tileClassName={functileClassName}
        // selectRange={true}
        // defaultValue={date}
        showFixedNumberOfWeeks={true}
        defaultActiveStartDate={date}
      />
    </div>
  );
};

const App = () => {
  const [habits, setHabits] = useState([]);
  // setHabits takes the json element of json habits databse, puts it into our new array which we've called habits
  // lookup useeffect, has 2 arguments, the first here is just an inline func li wrote, second is what to watch for to call function again (dependency array)
  useEffect(() => {
    fetch("http://localhost:3000/habits")
      .then((response) => response.json())
      .then((habits) => {
        console.log("Success:", habits);
        setHabits(habits);
      });
  }, []); // Empty array means nothing to watch, so only runs once

  const [myColorState, setmyColorState] = useState("#ffa726");
  const changeColor = () => {
    setmyColorState("#3700B3");
  };

  const [success, setSuccess] = useState(true);

  const handleChange = () => {
    setSuccess(success);
  };

  const [newCount, setNewCount] = useState(0);

  const callback = useCallback((newCount) => {
    setNewCount(newCount);
  }, []);

  const [msg, setMsg] = useState("Initial Message");

  const [parentInfo, setParentInfo] = useState(true);

  const [calendarDateText, setCalendarDateText] = useState("Date Label");

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <h1 className="text-center">React Calendar with Range</h1>
        <div className="flexcontainer">
          {/* <div id="leftSidebar" className="fixed"> </div> */}
          <JustMUIDrawer
            parentCallback={callback}
            className="fixed"
            myColorState={myColorState}
            propSetParentInfo={setParentInfo}
            propParentInfo={parentInfo}
          />
          <div className="flex-item">
            {/* <TheCalendarContainer /> */}
            <MemoCalendar propSetCalendarDateText={setCalendarDateText}/>
            <h2 style={{color: "black"}}> {calendarDateText} </h2>
            <StyledSlider
              success={success}
              onHandleChange={handleChange}
              defaultValue={30}
              propParentInfo={parentInfo}
              sx={{ mt: 1 }}
            />
            <Sidebar habits={habits} />
            <BorderTestButton />
            <DynamicCSS />
            <div style={{ border: "1px solid black", padding: 5, margin: 5 }}>
              <h1>I'm the parent, here's your message:</h1>
              <h1>{msg}</h1>
              <ExampleChild propSetMsg={setMsg} />
            </div>
            <AnotherExampleButton />
          </div>
        </div>
      </div>
    </ThemeProvider>
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
- Ans: apparently the event is somehow being passed into implicitly I think


*/
