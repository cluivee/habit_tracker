import React from "react";

const Sidebar = ({ habits }) => {
  return habits.map((habit) => {
    return (
      <div key={habit.id}>
        {habit.title} - {habit.color}
      </div>
    );
  });
};

export default Sidebar;
