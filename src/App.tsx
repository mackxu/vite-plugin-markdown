import ReactLogo from "./assets/react.svg?react";
import viteLogo from "/vite.svg";
import "./App.css";
import { Foo } from "./Foo";
import { Markdown } from "./Markdown";
import { useState } from "react";

function App() {
  const [visible, setVisible] = useState(true);
  return (
    <>
      <div>
        <Markdown file="test.md" />
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <span className="logo react">
            <ReactLogo style={{ fontSize: "6em" }} />
          </span>
        </a>
        <button onClick={() => setVisible(false)}>隐藏</button>
        {visible && <Foo />}
        <Markdown file="../README.md" />
      </div>
    </>
  );
}

export default App;
