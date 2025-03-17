import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Foo } from "./Foo";
import { Markdown } from "./Markdown";

function App() {
  return (
    <>
      <div>
        <Markdown file="test.md" />
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <Markdown file="test.md" />
        <Foo />
      </div>
    </>
  );
}

export default App;
