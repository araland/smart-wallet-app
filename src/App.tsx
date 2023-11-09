import { useRoutes } from "react-router-dom";
import routes from "./router";

import logo from "./logo.svg";
import "./App.css";

function App() {
  const content = useRoutes(routes);

  return <div className="App">{content}</div>;
}

export default App;
