import { BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import adminroute from "./Routing/AdminRoute/adminroute";
import authroute from "./Routing/AuthRoute/authroute";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {authroute()}
          {adminroute()}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
