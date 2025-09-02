import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import adminroute from "./Routing/AdminRoute/adminroute";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>{adminroute()}</Routes>
      </Router>
    </div>
  );
}

export default App;
