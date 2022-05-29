import React from "react";

const Sidebar = ({ habits }) => {
  return habits.map((habit) => {
    return (
      <div>
        {habit.title} - {habit.color}
      </div>
    );
  });
};

export default Sidebar;
