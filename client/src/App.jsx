import { useState } from "react";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import PrivateRoute from "../use/useSecureRoute";
import Signin from "../components/Signin";
import Login from "../components/Login";
import Secure from "../components/Secure";

import "./App.css";

function App() {
  const [loginStatus, setLoginStatus] = useState(false);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <div className="App">
            <Login setLoginStatus={setLoginStatus} loginStatus={loginStatus} />
            <Signin />
          </div>
        </Route>
        <PrivateRoute exact path="/secure">
          <Secure />
        </PrivateRoute>
      </Switch>
    </Router>
  );
}

export default App;
