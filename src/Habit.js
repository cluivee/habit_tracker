import { Button, Checkbox, TextField, ThemeProvider } from "@mui/material";
import React from "react";

const Habit = ({ propColor }) => {

  return (
    <div>

      {/* MUI button habit */}
      <Button
        variant="contained"
        onClick={() => {
          console.log("clicked");
        }}
        color={propColor}
        sx={{
          padding: 0,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          maxHeight: "30px",
          minHeight: "150px",
          borderRadius: 0
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
              color: "white",
              textTransform: "capitalize",
              fontWeight: "300",
              textAlign: "left",
              fontSize: "0.75rem",
              padding: "5px 5px 7px 5px",
            }}
          >
            Streak: 3
          </label>
        </div>
        <Checkbox
          color="default"
          style={{
            marginLeft: "auto",
          }}
        />
      </Button>
    </div>
  );
};

export default Habit;
