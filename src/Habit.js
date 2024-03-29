import {
  Button,
  Checkbox,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { useMemo, useEffect } from "react";

import habitsservice from "./services/habitsservice";

import { addDays, subDays, isSameDay, toDate } from "date-fns";

// This reusable component is the habit button in the left sidebar.

const Habit = ({
  id,
  propColor,
  propStreak,
  habits,
  setHabits,
  selectedHabitButtonId,
  setSelectedHabitButtonId,
  toggleDelete,
  important,
}) => {
  return (
    <div>
      {/* MUI button habit */}
      <Button
        variant="contained"
        color={propColor}
        onClick={() => {
          setSelectedHabitButtonId(id);
          const habit = habits.find((n) => n.id === id);
          const changedHabit = { ...habit};

          habitsservice
            .update(id, changedHabit)
            .then((returnedHabit) => {
              console.log("can we update? returnedHabit", returnedHabit);
              setHabits(
                habits.map((habit) => (habit.id !== id ? habit : returnedHabit))
              );
            })
            .catch((error) => {
              // setErrorMessage(
              //   `Note '${habit.color}' was already removed from server`
              // );
              // setTimeout(() => {
              //   setErrorMessage(null);
              // }, 2000);

              setHabits(habits.filter((n) => n.id !== id));
            });

          console.log("Habit button clicked id is: ", id);
        }}
        sx={{
          padding: 0,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          maxHeight: "30px",
          minHeight: "150px",
          borderRadius: 0,
        }}
      >
        <div
          style={{
            padding: "5px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxHeight: "30px",
            minHeight: "150px",
            flex: 8,
          }}
        >
          <TextField
            size="small"
            placeholder="New Habit"
            inputProps={{
              style: {
                padding: "5px",
                zIndex: 100,
              },
            }}
          ></TextField>
          {/* this is slightly horrible but to get the textfield and the label to be vertically centered they have to both be the same height, so I added 7px of padding at the bottom of the label so that both are 33px in height 
          padding shorthand: "t r b l"*/}
          <label
            style={{
              color: "#fff",
              textTransform: "capitalize",
              fontWeight: "300",
              textAlign: "left",
              fontSize: "1rem",
              padding: "5px 5px 7px 5px",
            }}
          >
            Streak: {propStreak}
          </label>

          {/* <Typography>{important.toString()}</Typography> */}
        </div>
        <Checkbox
          color="default"
          style={{
            marginLeft: "auto",
          }}
        />
      </Button>
      {/* The delete individual item button caused a lot of problems. When it was on top of the button, clicking the delete button also clicked the underlying habit button underneath at the same time, causing the id to be set to the just deleted habit, causing crashes. So at some point I must make sure that the buttons on top of the habit button don't overlap, and are actually on top*/}
      {/* <button onClick={() => toggleDelete(id)}>Delete this item</button> */}
    </div>
  );
};

export default Habit;
