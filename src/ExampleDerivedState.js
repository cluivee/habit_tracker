import React, {useState, useMemo} from "react";

const ExampleDerivedState = ({  }) => {
    let datey = (new Date());
    const date1 = (new Date('December 17, 1995 03:24:00'));
    const date2 = (new Date('December 17, 1995 03:24:00'));

  const [users, setUsers] = useState([
    {id: 1, name: "Kyle", age: 27, date: [datey, date1]},
    {id: 2, name: "Sally", age: 32, date: [date1]},
    {id: 3, name: "Mike", age: 54, date: []},
    {id: 4, name: "Jim", age: 16, date: []},
  ])

  const [selectedUserId, setSelectedUserId] = useState();
  const selectedUser = useMemo(() => users.find(user => user.id === selectedUserId), [users, selectedUserId]);

  // function I got off StackOverflow to check if date object is in array
  function isInArray(array, value) {
    return !!array.find(item => {return item.getTime() === value.getTime()});
  }

  function addDate(id) {
    setUsers(currUsers => {
        return currUsers.map(user => {
            if (user.id === id) {
                console.log(users);
                return {...user, date: isInArray(user.date, date2) ? user.date  : [...user.date, date2]}
            } else {
                return user
            }
        })
    })
  }

  function incrementAge(id) {
    setUsers(currUsers => {
        return currUsers.map(user => {
            if (user.id === id) {
                return {...user, age: user.age + 1}
            } else {
                return user
            }
        })

    })
  }

  function selectUser(id) {
    setSelectedUserId(id)
  }

  return(
    <>
        <h3>
            Selected: {" "}{selectedUser == null ? "None" : `${selectedUser.name} is ${selectedUser.age} years old`}
        </h3>
        {users.map(user => (
            <div key={user.id} style={{display:"grid", gridTemplateColumns:"1fr auto auto auto", gap: ".25rem", marginBottom: ".5rem"}}>
                {user.name} is {user.age} years old and date: {user.date.toString()}
                <button onClick={() => incrementAge(1)}>Increment</button>
                <button onClick={() => selectUser(user.id)}>Select</button>
                <button onClick={() =>{addDate(user.id)}}>Date</button>

            </div>
        ))}
    </>
  )
};

export default ExampleDerivedState;
