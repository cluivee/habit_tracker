import React from "react";
import { ListItem, List, ListItemText } from '@mui/material';

function MuiSidebar({items}) {
  return (
    <div className="sidebar">
      <List disablePadding dense>
        {items.map(({ label, name, ...rest }) => (
          <ListItem key={name} button {...rest}>
            <ListItemText>{label}</ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default MuiSidebar;
