import { useState } from "react";
import axios from "axios";

const Login = ({
  loginStatus,
  setLoginStatus,
  setIsAuthenticated,
  refreshing,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const login = async () => {
    try {
      const body = { email: email, password: password };
      const response = await axios.post(
        "http://localhost:4000/auth/login",
        body
      );
      if (response.data.auth) {
        localStorage.setItem(
          "access_token",
          "Bearer " + response.data.accessToken
        );
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
        setLoginStatus(true);
      }
    } catch (error) {
      console.log("Error login: ", error.response);
    }
  };

  const logout = () => {
    setLoginStatus(false);
    setIsAuthenticated(false);
    localStorage.removeItem("access_token");
    setMessage("");
  };

  const userAuthenticated = async () => {
    try {
      const response = await axios.get("http://localhost:4000/auth/isUserAuth");
      if (response.status === 200) {
        setMessage(response.data);
        setIsAuthenticated(true);
        refreshing();
      } else {
        console.log(response.data.message);
        setMessage(response.data.message);
      }
    } catch (error) {
      console.log("Error auth: ", error.response);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <div className="content-items">
        <label htmlFor="loginEmail">Email :</label>
        <input
          type="email"
          name="loginEmail"
          id="loginEmail"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="content-items">
        <label htmlFor="loginPassword">Password :</label>
        <input
          type="password"
          name="loginPassword"
          id="loginPassword"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="btn">
        <button onClick={login}>Login</button>
        {loginStatus && <button onClick={logout}>Logout</button>}
      </div>
      {loginStatus && (
        <button onClick={userAuthenticated}>Check Authentication JWT</button>
      )}
      <span>{message}</span>
    </div>
  );
};

export default Login;
