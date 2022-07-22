import React from "react";

const Sidebar = ({ habits, toggleImportanceOf }) => {

  return habits.map((habit) => {
    return (
      <div key={habit.id}>
      <li className='habitListItem'>
      <button onClick={() => toggleImportanceOf(habit.id)}>{habit.important ? 'make not important' : 'make important'}</button>
        {habit.title} - {habit.color}
        </li>
      </div>
        
    );
  });
};

export default Sidebar;
