import { useEffect, useState } from "react";
import axios from "axios";

import Signin from "../components/Signin";
import Login from "../components/Login";

import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [setLoginStatus, loginStatus] = useState({});

  useEffect(async () => {
    const response = await axios.get(`${import.meta.env.VITE_URL}/auth`);
    setUsers(response.data);
  }, [refresh]);

  const refreshing = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="App">
      <Login setLoginStatus={setLoginStatus} loginStatus={loginStatus} />
      <Signin refreshing={refreshing} />
      <ul>
        {users.map((user) => (
          <li>{user.user_email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
