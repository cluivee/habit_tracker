import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./App.css";
import habitsservice from "./services/habitsservice";
// Again this may not get used
import loginService from './services/login'

// The App component imports MyCalendar which is the main calendar/habit tracker component, Habit which is one of the buttons in the sidebar,
// and FirebaseAuthenticationComponent which is where I keep most of the components and functions for the sign in/sign out authentication.

// imports for files that are used
import MyCalendar, { MemoCalendar } from "./MyCalendar";
import Habit from "./Habit";
import FirebaseAuthenticationComponent from "./FirebaseAuthenticationComponent";

// imports for unused files
import Sidebar from "./Sidebar";
import SimpleHTMLSidebarTest from "./SimpleHTMLSidebarTest";
import ExampleChild from "./ExampleChild";

// imports for mui
import {
  Button,
  Box,
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

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

import { format, parseISO } from "date-fns";
import { orange } from "@mui/material/colors";

// imports for date-fns
import { addDays, subDays, isSameDay, toDate } from "date-fns";
import axios from "axios";

var r = document.querySelector(":root");

// Mui custom theme that we use for some colors and component style overrides
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

// width of the MUI drawer sidebar
const drawerWidth = 240;

// This is the left sidebar
const JustMUIDrawer = ({
  habits,
  setHabits,
  selectedHabitButtonId,
  setSelectedHabitButtonId,
  toggleDelete,
}) => {
  // 21.07.2022: this was used in some examples
  // const [buttonText, setButtonText] = useState("Not Selected");
  // const [cssColor, setCSSColor] = useState("#1affa0");

  const habitColorHexArray = [
    "#F24E1ECC",
    "#FF8D24CC",
    "#A259FFCC",
    "#0ACF83CC",
    "#1ABCFECC",
    "#FF7262CC",
  ];
  const habitColorArray = [
    "orange",
    "lightorange",
    "purple",
    "green",
    "blue",
    "pink",
  ];

  let habitList = habits.map((dict) => (
    <Habit
      key={dict.id}
      id={dict.id}
      propColor={dict.color}
      propStreak={dict.streak}
      important={dict.important}
      habits={habits}
      selectedHabitButtonId={selectedHabitButtonId}
      setSelectedHabitButtonId={setSelectedHabitButtonId}
      toggleDelete={toggleDelete}
    />
  ));

  const addHabitOnClick = () => {
    // we're now doing a get request on every click of the addHabit button to check that the length of habits is less than 30. If it turns out that response.length is manipulable in the browser anyway then there's no real point and we may as well count the length when we do the initial get in the useeffect. Probably the more secure way to do this is to store the no of habits a user has in the database, probably each user has a database entry, and they have an array with all their notes or smth like that.
    habitsservice.getAll().then((response) => {
      console.log("Check response length:", response.length);
      if (response.length < 31) {
        // in our habitobject we will now have to post the user, which we will only get from the uid
        const habitObject = {
          color: habitColorArray[habits.length % 6],
          colorHex: habitColorHexArray[habits.length % 6],
          maxStreak: 0,
          streak: 0,
          ticked: [],
        };
        habitsservice.create(habitObject).then((returnedNote) => {
          setHabits(habits.concat(returnedNote));
          if (habits.length === 0) {
            setSelectedHabitButtonId(returnedNote.id);
          }
          console.log("addhabit currentID: ", selectedHabitButtonId);
        });
      } else {
        console.log("Maximum number of habits is 30");
      }
    });

    // propSetHabitDict((propHabitDict) => [
    //   ...propHabitDict,
    //   {
    //     id: propHabitDict.length + 1,
    //     // color: propHabitDict[propHabitDict.length - 6].color,
    //     color: habitColorArray[propHabitDict.length % 6],
    //     colorHex: habitColorHexArray[propHabitDict.length % 6],
    //     maxStreak: 0,
    //     streak: 0,
    //     ticked: [],
    //   },
    // ]);
  };

  const deleteHabitOnClick = () => {
    if (habits.length === 0) {
      console.log('habits is already empty, cannot delete anything');
      return
    }
    const idLastItem = habits.at(-1).id;

    const idSecondLastItem = habits.length >= 2 ? habits.at(-2).id : '';

    const baseUrl = "/api/notes";

    if (habits.length > 1) {
      axios.delete(`${baseUrl}/${idLastItem}`).then(() => {
        setHabits([...habits.slice(0, habits.length - 1)]);
        if (selectedHabitButtonId === idLastItem) {
          setSelectedHabitButtonId(idSecondLastItem);
          console.log("currentID: ", idSecondLastItem);
        } else {
          console.log("currentID: ", idLastItem);
        }
      });
    } else if (habits.length === 1) {
      axios.delete(`${baseUrl}/${idLastItem}`).then(() => {
        setHabits([]);
        // This is now set to just an arbitrary id of 1, it is not an actual mongoDB id
        setSelectedHabitButtonId(1);
        console.log("currentID: ", 1);
      });
    } else {
      console.log("habits is already empty");
    }

    // if (habits.length > 1) {
    //   axios.delete("http://localhost:3000/habits/" + idLastItem).then(() => {
    //     setHabits([...habits.slice(0, habits.length - 1)]);
    //     if (selectedHabitButtonId === idLastItem) {
    //       setSelectedHabitButtonId(idLastItem - 1);
    //       console.log('currentID: ', idLastItem - 1);
    //     } else {
    //       console.log('currentID: ', idLastItem);
    //     }
    //   });
    // } else if (habits.length === 1) {
    //   axios.delete("http://localhost:3000/habits/" + idLastItem).then(() => {
    //     setHabits([]);
    //     setSelectedHabitButtonId(1);
    //     console.log('currentID: ', 1);
    //   });
    // } else {
    //   console.log("habits is already empty");
    // }

    // if (habits.length > 1) {
    //   setHabits((habits) =>
    //     habits.filter((item) => item.id !== habits.length)
    //   );
    //   if (propSelectedHabitButtonId === habits.length) {
    //     propSetSelectedHabitButtonId(habits.length - 1);
    //   }
    // }
  };

  // 21.07.2022: Example of how to handle event change
  // function childHandleChange(e) {
  //   console.log(e.target.value);
  //   this.props.onHandleChange(e.target.value);
  // }

  // 05/07/2022: Keeping this as an example of how to change the css variable colors
  // Eventually I've stopped wondering why changing the css variable --main-color which sets the border color of the active tile, whites out the border onClick. The border is actually set in a hover state which may be messing it up somehow

  // const handleClick = (event) => {
  //   cssColor === "#1affa0" ? setCSSColor("#eb31b3") : setCSSColor("#1affa0");
  //   buttonText === "Selected"
  //     ? setButtonText("Not Selected")
  //     : setButtonText("Selected");
  //   document.documentElement.style.setProperty("--main-color", cssColor);
  //   document.documentElement.style.setProperty("--toggled-color", "blue");
  //   console.log(
  //     "--main-color value: " +
  //       document.documentElement.style.getPropertyValue("--main-color")
  //   );
  //   propParentInfo ? propSetParentInfo(false) : propSetParentInfo(true);
  //   propSetCurrentColor(cssColor);

  //   console.log("blue Sidebar Click and current dict: " + propCurrentDict);

  //   if (propCurrentDict === "orig") {
  //     propSetOrigDict(propActiveDict);
  //   } else if (propCurrentDict === "blue") {
  //     propSetBlueDict(propActiveDict);
  //   } else if (propCurrentDict === "purple") {
  //     propSetPurpleDict(propActiveDict);
  //   }
  //   console.log("blueDict after being set: ");
  //   console.log(propBlueDict);
  //   propSetCurrentDict("blue");
  //   console.log("marked currentdict blue");
  // };

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

      {/* "Add Habit" button */}
      <Button
        variant="contained"
        onClick={addHabitOnClick}
        sx={{
          margin: "10px",
          textTransform: "none",
          color: "#fff",
          minHeight: "50px",
          fontWeight: "400",
          fontSize: "1rem",
          letterSpacing: "0.00938em",
        }}
      >
        + Add Habit
      </Button>

      {/* "Delete Habit" button */}
      <Button
        variant="contained"
        onClick={deleteHabitOnClick}
        sx={{
          margin: "10px",
          textTransform: "none",
          color: "#fff",
          minHeight: "50px",
          fontWeight: "400",
          fontSize: "1rem",
          letterSpacing: "0.00938em",
        }}
      >
        - Delete Habit
      </Button>

      {/* Example of the original contents of the MUI sidebar drawer, including dividers */}
      {/* 
      <Toolbar />
      <Divider />
      <List>
        {["Inbox"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
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
       */}

      <List>
        {/* Example of the second half of the drawer */}
        {/* {["All mail"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))} */}

        {/* MUI button tutorial */}
        {/* <Button
          variant="outlined"
          color="primary"
          fullWidth
          size="large"
          style={{
            maxHeight: "30px",
            minHeight: "60px",
          }}
          onClick={handleClick}
        >
          {buttonText}
        </Button> */}
      </List>
    </Drawer>
  );
};

// Examples for dynamic css slider and button which changes border color onclick

// const StyledSlider = styled(Slider, {
//   shouldForwardProp: (prop) => prop !== "success",
// })(({ success, theme }) => ({
//   width: 300,
//   ...(success && {
//     color: theme.palette.success.main,
//     "& .MuiSlider-thumb": {
//       [`&:hover, &.Mui-focusVisible`]: {
//         boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.success.main, 0.16)}`,
//       },
//       [`&.Mui-active`]: {
//         boxShadow: `0px 0px 0px 14px ${alpha(
//           theme.palette.success.main,
//           0.16
//         )}`,
//       },
//     },
//   }),
// }));

// function DynamicCSS() {
//   const [success, setSuccess] = useState(false);

//   const handleChange = (event) => {
//     setSuccess(event.target.checked);
//   };

//   return (
//     <React.Fragment>
//       <FormControlLabel
//         control={
//           <Switch
//             checked={success}
//             onChange={handleChange}
//             color="primary"
//             value="dynamic-class-name"
//           />
//         }
//         label="Success"
//       />
//       <StyledSlider success={success} defaultValue={30} sx={{ mt: 1 }} />
//     </React.Fragment>
//   );
// }

// const BorderTestButton = () => {
//   const [check, setCheck] = useState(true);
//   const [buttonColor, setColor] = useState("yellow");
//   const [borders, setBorders] = useState("black");

//   function changeButtonColors() {
//     if (check === true) {
//       setColor("black");
//       setCheck(false);
//       setBorders("#0ACF83");
//     } else {
//       setColor("yellow");
//       setCheck(true);
//       setBorders("black");
//     }
//   }
//   return (
//     <button
//       style={{
//         background: buttonColor,
//         color: "newColor",
//         height: "100px",
//         width: "200px",
//         border: "5px solid",
//         borderColor: borders,
//       }}
//       onClick={changeButtonColors}
//     >
//       Click here
//     </button>
//   );
// };

// Example Notification form fullstackopen, might be useful later
// const Notification = ({ message }) => {
//   if (message === null) {
//     return null
//   }

//   return (
//     <div className='errorNotificationBox'>
//       {message}
//     </div>
//   )
// }

const App = () => {
  // const [habits, setHabits] = useState([]);
  // setHabits takes the json element of json habits databse, puts it into our new array which we've called habits
  // lookup useeffect, has 2 arguments, the first here is just an inline func li wrote, second is what to watch for to call function again (dependency array)
  // Empty dependency array means nothing to watch, so only runs once
  // useEffect(() => {
  //   fetch("http://localhost:3000/habits")
  //     .then((response) => response.json())
  //     .then((habits) => {
  //       console.log("Successful:", habits);
  //       setHabits(habits);
  //     });
  // }, []);

  useEffect(() => {
    habitsservice.getAll().then((response) => {
      console.log("Successful:", response);
      setHabits(response);
      setSelectedHabitButtonId(response[0].id);
    });
  }, []);

  const toggleImportanceOf = (id) => {
    const habit = habits.find((n) => n.id === id);
    console.log('toggleimportance: habits: ', habits);
    console.log('toggleimportance: singular habit: ', habit);
    const changedHabit = { ...habit, important: !habit.important };
    console.log('changedHabit: ', changedHabit);

    habitsservice
      .update(id, changedHabit)
      .then((returnedHabit) => {
        console.log('returnedHabit', returnedHabit)
        console.log('returnedHabitd date', returnedHabit.date, typeof returnedHabit.date,)
        setHabits(
          habits.map((habit) => (habit.id !== id ? habit : returnedHabit))
        );
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${habit.color}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 2000);

        setHabits(habits.filter((n) => n.id !== id));
      });
  };

  const toggleDelete = (id) => {
    let elementPos = habits
      .map((x) => {
        return x.id;
      })
      .indexOf(id);
    const baseUrl = "/api/notes";

    let nextId = (function () {
      // habits is about to become empty
      if (habits.length === 1) {
        return 1;
      }
      // habits has at least length 2 and we have selected the first element
      else if (elementPos === 0) {
        return habits[elementPos + 1].id;
      }
      // habits has at least length 2 and we can move the id down one
      else {
        return habits[elementPos - 1].id;
      }
    })();

    axios
      .delete(`${baseUrl}/${id}`)
      .then(() => {
        setHabits(habits.filter((n) => n.id !== id));
        console.log("toggleDelete id: ", id);
        console.log(
          "toggleDelete selectedHabitButtonId: ",
          selectedHabitButtonId
        );
        if (selectedHabitButtonId === id) {
          setSelectedHabitButtonId(nextId);
          console.log("currentID: ", nextId);
        } else {
          console.log("currentID: ", id);
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("item already deleted");
      });
  };

  // probably dont need any of this now - this method is usually called on click of the sign in form 
  // const handleLogin = async (event) => {
  //   event.preventDefault()
    
  //   try {
  //     // const user = await loginService.login({
  //     //   username, password,
  //     // })
  //     setUserToken(null)
  //     // setUsername('')
  //     // setPassword('')
  //   } catch (exception) {
  //     setErrorMessage('Wrong credentials')
  //     setTimeout(() => {
  //       setErrorMessage(null)
  //     }, 5000)
  //   }
  // }


  // States for the whole app, there ought to be only 5.
  // This state is to store the variables for all the habits in the sidebar
  const [habitDict, setHabitDict] = useState([
    {
      id: 1,
      color: "orange",
      colorHex: "#F24E1ECC",
      maxStreak: 0,
      streak: 0,
      ticked: [],
      newness: "old",
    },
    {
      id: 2,
      color: "lightorange",
      colorHex: "#FF8D24CC",
      maxStreak: 0,
      streak: 0,
      ticked: [],
      newness: "old",
    },
    {
      id: 3,
      color: "purple",
      colorHex: "#A259FFCC",
      maxStreak: 0,
      streak: 0,
      ticked: [],
      newness: "old",
    },
    {
      id: 4,
      color: "green",
      colorHex: "#0ACF83CC",
      maxStreak: 0,
      streak: 0,
      ticked: [],
      newness: "old",
    },
    {
      id: 5,
      color: "blue",
      colorHex: "#1ABCFECC",
      maxStreak: 0,
      streak: 0,
      ticked: [],
      newness: "old",
    },
    {
      id: 6,
      color: "pink",
      colorHex: "#FF7262CC",
      maxStreak: 0,
      streak: 0,
      ticked: [],
      newness: "old",
    },
  ]);

  const [habits, setHabits] = useState([]);

  const [theUser, setTheUser] = useState(null);

  // We're going to keep this if we want to refrence the token from app, and it is set in "onauthstatechanged" in the firebaseauthenticationcomponent, but we might not need this and it could be deleted

  const [userToken, setUserToken] = useState(null);

  const [errorMessage, setErrorMessage] = useState("some error happened...");

  // const [msg, setMsg] = useState("Initial Message");

  // state for the id of the button of the currently selected habit
  const [selectedHabitButtonId, setSelectedHabitButtonId] = useState(1);

  // state for the currently selected date
  const [calendarDate, setCalendarDate] = useState(new Date());

  // this doesn't feel like the correct way to tell if a button was clicked, but it works for now, it also adds an extra state unfortunately
  const [calendarButtonBoolean, setCalendarButtonBoolean] = useState(false);

  // The currently selected habit
  const selectedDict = useMemo(
    () => {console.log('selectedDict Memo ran, and selectedDict is: ', habits.find((dict) => dict.id === selectedHabitButtonId));
       return habits.find((dict) => dict.id === selectedHabitButtonId)},
    [habits, selectedHabitButtonId]
  );

  let currentStreak = 0;

  // state for which component we want to show (works like React Router I think). This has been moved up to App from FirebaseAuthenticationComponent, though I may want to move it back down to prevent rerenderings
  const [showComponent, setshowComponent] = useState("SignUp");

  // This effect runs each time a date on the calendar is clicked, and calculates the current streak of consecutive dates clicked from today backwards.
  useEffect(() => {
    console.log("Habit Streak updated");

    if (habits.length > 0) {
      const posToday = selectedDict.ticked.findIndex((item) => {
        console.log('item to check for datefns strings ', item, typeof item)
        // if parseISO doesn't work we can revert to this:
        // return isSameDay(item, new Date());
        return isSameDay(parseISO(item), new Date());
      });

      const posYesterday = selectedDict.ticked.findIndex((item) => {
        console.log('item to check for datefns strings ', item, typeof item)
        return isSameDay(parseISO(item), subDays(new Date(), 1));
      });

      // logic to calculate the current streak. Streak can start from today or yesterday
      if (posToday !== -1) {
        currentStreak++;
        for (var i = posToday; i > 0; i--) {
          if (
            !isSameDay(
              subDays(selectedDict.ticked[i], 1),
              selectedDict.ticked[i - 1]
            )
          ) {
            break;
          }
          currentStreak++;
        }
      } else if (posYesterday !== -1) {
        currentStreak++;
        for (var i = posYesterday; i > 0; i--) {
          if (
            !isSameDay(
              subDays(selectedDict.ticked[i], 1),
              selectedDict.ticked[i - 1]
            )
          ) {
            break;
          }
          currentStreak++;
        }
      }

      setHabits((currActiveDict) => {
        return currActiveDict.map((dict) => {
          if (dict.id === selectedHabitButtonId) {
            return { ...dict, streak: currentStreak };
          } else {
            return dict;
          }
        });
      });
    }
  }, [calendarButtonBoolean]);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <div className="flexcontainer">
          <JustMUIDrawer
            className="fixed"
            habits={habits}
            setHabits={setHabits}
            selectedHabitButtonId={selectedHabitButtonId}
            setSelectedHabitButtonId={setSelectedHabitButtonId}
            toggleDelete={toggleDelete}
          />
          <div className="flex-item">
            <FirebaseAuthenticationComponent
              showComponent={showComponent}
              setshowComponent={setshowComponent}
              userToken={userToken}
              setUserToken={setUserToken}
              theUser={theUser}
              setTheUser={setTheUser}

            />
            {theUser && showComponent === "Home" ? (
              <MemoCalendar
                setCalendarDate={setCalendarDate}
                habits={habits}
                setHabits={setHabits}
                selectedHabitButtonId={selectedHabitButtonId}
                calendarButtonBoolean={calendarButtonBoolean}
                setCalendarButtonBoolean={setCalendarButtonBoolean}
              />
            ) : null}
            {/* Ignore everything after this point*/}
            <Sidebar
              habits={habits}
              toggleImportanceOf={toggleImportanceOf}
              toggleDelete={toggleDelete}
            />

            {/* <div style={{ border: "1px solid black", padding: 5, margin: 5 }}>
              <h1>I'm the parent, here's your message:</h1>
              <h1>{msg}</h1>
              <ExampleChild propSetMsg={setMsg} />
            </div> */}
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

For real users - backend, can use postgresSQL, express, (knex, framework for ORM with express, can be easier), 
set up database connection, then other than that making queries with knex. 

Stick with official react docs
Learn react, learn hooks, usestate,useeffect
learn react, understand what components I will build, what data will flow through the components and how, where you keep state and API requests

Break down into chucks
Done:
- Make front end in react
- make calendar
- make buttons that are clickable
- sidebar of habits
- count streak
- make it look good/ material ui
- logins

- save the state of buttons
- save the database of the days that have been clicked
- have lots of colours on one square
- save preferences

TODO 24.07.2022:
- Something we probably ought to do at some point is with the axios delete ensure their have an authentication token:
axios.delete(URL, {
  headers: {
    Authorization: authorizationToken
  },
  data: {
    source: source
  }
});

TODO 22.07.2022:
- Remove all the selectors like h1 from CSS files, as they might be clashing with MUI styles. The specific classnames can probably stay as they're unlikely to clash with other things, unless they wrap child components that are affected by the positioning
- checkboxes don't work at all.
- perhaps log out button could say 'sign in' when you log in successfully?

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

