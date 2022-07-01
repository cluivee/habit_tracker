import React, {useState} from "react";

const ExampleDerivedState = ({  }) => {
  const [users, setUsers] = useState([
    {id: 1, name: "Kyle", age: 27},
    {id: 2, name: "Sally", age: 32},
    {id: 3, name: "Mike", age: 54},
    {id: 4, name: "Jim", age: 16},
  ])

  const [selectedUser, setSelectedUser] = useState();

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
    const user = users.find(user => user.id === id)
    setSelectedUser(user)
  }

  return(
    <>
        <h3>
            Selected: {" "}{selectedUser == null ? "None" : `${selectedUser.name} is ${selectedUser.age} years old`}
        </h3>
        {users.map(user => (
            <div key={user.id} style={{display:"grid", gridTemplateColumns:"1fr auto auto", gap: ".25rem", marginBottom: ".5rem"}}>
                {user.name} is {user.age} years old
                <button onClick={() => incrementAge(user.id)}>Increment</button>
                <button onClick={() => selectUser(user.id)}>Select</button>
            </div>
        ))}
    </>
  )
};

export default ExampleDerivedState;
