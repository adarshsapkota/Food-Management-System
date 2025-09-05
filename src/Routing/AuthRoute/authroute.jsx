import { Route } from "react-router-dom";
import LogIn from "../../Auth/Login";
import SignUp from "../../Auth/SignUp";

export default function authroute() {
  return (
    <Route>
      <Route path="/" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Route>
  );
}
