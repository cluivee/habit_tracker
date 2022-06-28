import * as React from "react";
import { memo, useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";

import "./MUIGridExample.css";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function RowAndColumnSpacing() {
  let newCount = 1;
  let years = Array(31)
    .fill()
    .map(() => newCount++);

  let buttonTexts = ["1", "2", "3", "4"];

  const something = "100%";

  let buttonList = years.map((year, index) => {
    return (
      <Grid item xs={1}>
        <Button fullWidth style={{ height: "100px" }} variant="contained">
          {year}
        </Button>
      </Grid>
    );
  });

  console.log(buttonList);

  const Cells = memo(() => {
    // const monthStart = startOfMonth(currentDate);
    // const monthEnd = endOfMonth(monthStart);
    // const startDate = startOfWeek(monthStart);
    // const endDate = endOfWeek(monthEnd);
    // const dateFormat = "dd";
    const rows = [];
    let days = [];
    let formattedDate = "";

    const [clickedDay, setClickedDay] = useState(new Date());

    let j = 0;
    while (j <= years.length) {
        
        days.push(<Button fullWidth style={{ height: something }} variant="contained">{years[j]}</Button>);

    //   for (let i = 0; i < 7; i++) {


    //     days.push(<Button variant="contained">{years[i]}</Button>);
    //     // day = addDays(day, 1);
    //   }

    //   rows.push(
    //     <div className="row" key={years[j]}>
    //       {days}
    //     </div>
    //   );
    //   console.log("refreshing rows");
    //   days = [];
      j++;
    }
    console.log(days)
    // propSetDatesArray(intermediateArray);
    return days
  });

  return (
    <div class="container"><Cells/></div>

    // <Box sx={{ width: '100%' }}>
    //   <Grid container rowSpacing={1} spacing={10} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={7}>
    //     {buttonList}
    //   </Grid>

    // </Box>
  );
}
