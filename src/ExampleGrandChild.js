import { useState } from "react";

// interface GrandChildProps {
//   setMsg: (msg: string) => void;
// }

function GrandChild({anotherPropSetMsg}) {
  const [text, setText] = useState("");

  return (
    <div style={{ border: "1px solid black", padding: 5, margin: 5 }}>
      <h3>I'm the grandchild, type your message here:</h3>
      <input
        type="text"
        value={text}
        // this bit is kind of clever as well
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={() => anotherPropSetMsg(text)}>Send message</button>
    </div>
  );
}
export default GrandChild;