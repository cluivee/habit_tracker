import React, { useEffect, useState, useCallback } from "react";
import MyCalendar, { MemoCalendar } from "./MyCalendar";
import Sidebar from "./Sidebar";
import Habit from "./Habit";
import "./App.css";
import Calendar from "react-calendar";
// import 'react-calendar/dist/Calendar.css';
import SimpleHTMLSidebarTest from "./SimpleHTMLSidebarTest";
import { Button, Box, Drawer } from "@mui/material";
import MuiSidebar from "./MuiSidebar";
import ExampleChild from "./ExampleChild";

// below are imports for mui drawer
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
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";

import { ThemeProvider, createTheme } from "@mui/material/styles";

// Imports for mui dynamic css slider
import { alpha, styled } from "@mui/material/styles";
import Slider from "@mui/material/Slider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

var r = document.querySelector(":root");

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
      light: "#3700B3",
      dark: "#3700B3",
      contrastText: "#fff",
    },
    orange: {
      main: "#F24E1ECC",
      contrastText: "#fff",
    },
    lightorange: {
      main: "#FF8D24CC",
      contrastText: "#fff",
    },
    purple: {
      main: "#A259FFCC",
      contrastText: "#fff",
    },
    green: {
      main: "#0ACF83CC",
      contrastText: "#fff",
    },
    blue: {
      main: "#1ABCFECC",
      contrastText: "#fff",
    },
    pink: {
      main: "#FF7262CC",
      contrastText: "#fff",
    },
    white: {
      main: "#fff",
      contrastText: "#fff",
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#fff",
          color: "#000",
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          fontSize: "1.1rem",
          color: "#000",
        },
      },
    },
  },
});

const drawerWidth = 240;

// DynamicCSS styledSlider test
const StyledSlider = styled(Slider, {
  shouldForwardProp: (prop) => prop !== "success",
})(({ success, theme }) => ({
  width: 300,
  ...(success && {
    color: theme.palette.success.main,
    "& .MuiSlider-thumb": {
      [`&:hover, &.Mui-focusVisible`]: {
        boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.success.main, 0.16)}`,
      },
      [`&.Mui-active`]: {
        boxShadow: `0px 0px 0px 14px ${alpha(
          theme.palette.success.main,
          0.16
        )}`,
      },
    },
  }),
}));

function DynamicCSS() {
  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
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

const JustMUIDrawer = ({
  propSetParentInfo,
  propParentInfo,
  propCount,
  propSetCurrentColor,
  propActiveDict,
  propSetActiveDict,
  propSetOrigDict,
  propSetBlueDict,
  propSetPurpleDict,
  propOrigDict,
  propBlueDict,
  propPurpleDict,
  propCurrentDict,
  propSetCurrentDict,
}) => {
  const [btnColor, setBtnColor] = useState("myColor");
  const [buttonText, setButtonText] = useState("Not Selected");
  const [button2Text, setButton2Text] = useState("Not Selected");
  const [cssColor, setCSSColor] = useState("#1affa0");
  const [colorToggle, setColorToggle] = useState(false);

  let habitColors = [
    "orange",
    "lightorange",
    "purple",
    "green",
    "blue",
    "pink",
  ];
  let habitList = habitColors.map((habitColor, index) => {
    return <Habit key={index} propColor={habitColor} />;
  });

  useEffect(() => {
    console.log("useEffect ran because currentDict changed");
    if (propCurrentDict === "orig") {
      console.log("useeffect ran and currentdict is orig");
      propSetActiveDict(propOrigDict);
    } else if (propCurrentDict === "blue") {
      console.log("useeffect ran and currentdict is blue");
      propSetActiveDict(propBlueDict);
    } else if (propCurrentDict === "purple") {
      console.log("useeffect ran and currentdict is purple");
      propSetActiveDict(propPurpleDict);
    }
  }, [propCurrentDict]);

  function childHandleChange(e) {
    console.log(e.target.value);
    this.props.onHandleChange(e.target.value);
  }

  const origHandleClick = (event) => {
    document.documentElement.style.setProperty("--toggled-color", "#000");

    // handleclick and setting dicts here
    console.log("orig Sidebar Click and current dict: " + propCurrentDict);

    if (propCurrentDict === "orig") {
      propSetOrigDict(propActiveDict);
    } else if (propCurrentDict === "blue") {
      propSetBlueDict(propActiveDict);
    } else if (propCurrentDict === "purple") {
      propSetPurpleDict(propActiveDict);
    }
    propSetCurrentDict("orig");
    console.log("marked currentdict orig");
  };

  // Eventually I've stopped wondering why changing the css variable --main-color which sets the border color of the active tile, whites out the border onClick. The border is actually set in a hover state which may be messing it up somehow
  const handleClick = (event) => {
    cssColor === "#1affa0" ? setCSSColor("#eb31b3") : setCSSColor("#1affa0");
    buttonText === "Selected"
      ? setButtonText("Not Selected")
      : setButtonText("Selected");
    document.documentElement.style.setProperty("--main-color", cssColor);
    document.documentElement.style.setProperty("--toggled-color", "blue");
    console.log(
      "--main-color value: " +
        document.documentElement.style.getPropertyValue("--main-color")
    );
    propParentInfo ? propSetParentInfo(false) : propSetParentInfo(true);
    propSetCurrentColor(cssColor);

    // handleclick and setting dicts here
    console.log("blue Sidebar Click and current dict: " + propCurrentDict);

    if (propCurrentDict === "orig") {
      propSetOrigDict(propActiveDict);
    } else if (propCurrentDict === "blue") {
      console.log("ActiveDict: ");
      console.log(propActiveDict);
      console.log("blueDict before being set: ");
      console.log(propBlueDict);
      propSetBlueDict(propActiveDict);
    } else if (propCurrentDict === "purple") {
      propSetPurpleDict(propActiveDict);
    }
    console.log("blueDict after being set: ");
    console.log(propBlueDict);
    propSetCurrentDict("blue");
    console.log("marked currentdict blue");
  };

  const handle2Click = (event) => {
    cssColor === "#1affa0" ? setCSSColor("#eb31b3") : setCSSColor("#1affa0");
    button2Text === "Selected"
      ? setButton2Text("Not Selected")
      : setButton2Text("Selected");
    document.documentElement.style.setProperty("--main-color", cssColor);
    document.documentElement.style.setProperty("--toggled-color", "purple");
    console.log(
      "--main-color value: " +
        document.documentElement.style.getPropertyValue("--main-color")
    );
    console.log(cssColor);
    propParentInfo ? propSetParentInfo(false) : propSetParentInfo(true);
    propSetCurrentColor(cssColor);

    // handleclick and setting dicts here
    console.log("purple Sidebar Click and current dict: " + propCurrentDict);

    if (propCurrentDict === "orig") {
      propSetOrigDict(propActiveDict);
    } else if (propCurrentDict === "blue") {
      propSetBlueDict(propActiveDict);
    } else if (propCurrentDict === "purple") {
      propSetPurpleDict(propActiveDict);
    }
    console.log("purpleDict after being set: ");
    console.log(propPurpleDict);

    propSetCurrentDict("purple");
    console.log("marked currentdict purple");
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
      {habitList}
      <Toolbar />
      <Divider />
      <List>
        {["Inbox"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {/* {(index % 2 === 0 ? <InboxIcon /> : <MailIcon />) */}
                {(() => {
                  if (index === 0) {
                    return <InboxIcon />;
                  } else if (index === 1) {
                    return <MailIcon />;
                  } else if (index === 2) {
                    return <SendIcon />;
                  } else if (index === 3) {
                    return <DraftsIcon />;
                  }
                })()}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail"].map((text, index) => (
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
          color="inherit"
          fullWidth
          size="large"
          style={{
            maxHeight: "30px",
            minHeight: "60px",
          }}
          onClick={origHandleClick}
        >
          Orig Button
        </Button>
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
      </List>
    </Drawer>
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
        console.log("Successful:", habits);
        setHabits(habits);
      });
  }, []); // Empty array means nothing to watch, so only runs once

  const [myColorState, setmyColorState] = useState("#ffa726");

  const changeColor = () => {
    setmyColorState("#3700B3");
  };

  const [newCount, setNewCount] = useState(0);

  const [msg, setMsg] = useState("Initial Message");
  const [parentInfo, setParentInfo] = useState(true);
  const [calendarDateText, setCalendarDateText] = useState("Date Label");
  const [currentDict, setCurrentDict] = useState("orig");
  const [origDict, setOrigDict] = useState({});
  const [blueDict, setBlueDict] = useState({});
  const [purpleDict, setPurpleDict] = useState({});

  const [activeDict, setActiveDict] = useState(origDict);

  const [currentColor, setCurrentColor] = useState("tiger");

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <div className="flexcontainer">
          {/* <div id="leftSidebar" className="fixed"> </div> */}
          <JustMUIDrawer
            className="fixed"
            myColorState={myColorState}
            propSetParentInfo={setParentInfo}
            propParentInfo={parentInfo}
            propSetCurrentColor={setCurrentColor}
            propActiveDict={activeDict}
            propSetActiveDict={setActiveDict}
            propSetOrigDict={setOrigDict}
            propSetBlueDict={setBlueDict}
            propSetPurpleDict={setPurpleDict}
            propOrigDict={origDict}
            propBlueDict={blueDict}
            propPurpleDict={purpleDict}
            propCurrentDict={currentDict}
            propSetCurrentDict={setCurrentDict}
          />
          <div className="flex-item">
            <h1 className="text-center">React Calendar with Range</h1>
            {/* <TheCalendarContainer /> */}
            <MemoCalendar
              propSetCalendarDateText={setCalendarDateText}
              propActiveDict={activeDict}
              propSetActiveDict={setActiveDict}
              propSetOrigDict={setOrigDict}
              propSetBlueDict={setBlueDict}
              propSetPurpleDict={setPurpleDict}
              propCurrentDict={currentDict}
              propCurrentColor={currentColor}
            />
            <h2 style={{ color: "black" }}> {calendarDateText} </h2>

            <Sidebar habits={habits} />
            <BorderTestButton />
            <DynamicCSS />
            <div style={{ border: "1px solid black", padding: 5, margin: 5 }}>
              <h1>I'm the parent, here's your message:</h1>
              <h1>{msg}</h1>
              <ExampleChild propSetMsg={setMsg} />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;

/*
Notes on React Habit Tracker Project

What are my aims for the app?
1. Damn pretty
2. Damn performant (fast)
3. A pleasure to use 
4. Free, for at least all the features I would want to use. Maybe will do themes or filters (like the facebook filter that StackOverflow did for April Fools) as paid options

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

TODO 26.06.2022:
- Perhaps try to rewrite the orig/blue/purple dicts using this "derived state" example from this video (webdevsimplified): https://www.youtube.com/watch?v=tz0fDABt67g.
I'm thinking to have one object that stores all the dicts, perhaps each dict has an id at the front so we can reference them, then the colour, Then we have an array of dates.

*/
