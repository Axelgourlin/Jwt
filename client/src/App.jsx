import { useEffect, useState } from "react";
import axios from "axios";

import Signin from "../components/Signin";
import Login from "../components/Login";

import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(async () => {
    if (loginStatus) {
      const response = await axios.get(`${import.meta.env.VITE_URL}/auth`);
      setUsers(response.data);
    }
  }, [refresh]);

  const refreshing = () => {
    console.log("coucou");
    setRefresh(!refresh);
  };

  return (
    <div className="App">
      <Login
        setIsAuthenticated={setIsAuthenticated}
        setLoginStatus={setLoginStatus}
        loginStatus={loginStatus}
        refreshing={refreshing}
      />
      <Signin refreshing={refreshing} />
      <ul>
        {isAuthenticated &&
          users.map((user) => <li key={user.id}>{user.user_email}</li>)}
      </ul>
    </div>
  );
}

export default App;
