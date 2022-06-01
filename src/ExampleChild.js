import ExampleGrandChild from "./ExampleGrandChild";

// interface ChildProps {
//   setMsg: (msg: string) => void;
// }

// Example taken from https://codesandbox.io/s/determined-pine-1z9ms?file=/src/Parent.tsx:153-335

/*
 Let's recap how this example works. You can name a prop anything from the parent, 
 you just declare it when you add a child to the render function. That same prop name,
 Then must be used by the child component, and passed in as an argument. In this case,
 that prop is a function, so we can actually just call that function from a child with
 propSetMsg() at any time.
*/


function ExampleChild({propSetMsg}) {
  return (
    <div style={{ border: "1px solid black", padding: 5, margin: 5 }}>
      <h2>I'm the child, just passing down the handler</h2>
      <ExampleGrandChild anotherPropSetMsg={propSetMsg} />
    </div>
  );
}
export default ExampleChild;