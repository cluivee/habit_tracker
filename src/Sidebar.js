import React from "react";

const Sidebar = ({ habits, toggleImportanceOf, toggleDelete }) => {

  return habits.map((habit) => {
    return (
      <div key={habit.id}>
      <li className='habitListItem'>
      <button onClick={() => toggleImportanceOf(habit.id)}>{habit.important ? 'make not important' : 'make important'}</button>
        {habit.id} - {habit.colorHex} - {habit.color} - {habit.newness}
      <button onClick={() => toggleDelete(habit.id)}>Delete this item</button>
        </li>
      </div>
        
    );
  });
};

export default Sidebar;
