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
        `${import.meta.env.VITE_URL}/auth/login`,
        body
      );
      if (response.data.auth) {
        localStorage.setItem(
          "access_token",
          "Bearer " + response.data.access_token
        );
        localStorage.setItem("refresh_token", response.data.refresh_token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.access_token}`;
        setLoginStatus(true);
      }
    } catch (error) {
      console.log("Error login: ", error.response);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("refresh_token");
      const res = await axios.post(`${import.meta.env.VITE_URL}/auth/logout`, {
        token,
      });
      if (res) {
        setLoginStatus(false);
        setIsAuthenticated(false);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        delete axios.defaults.headers.common["Authorization"];
        setMessage("");
      }
    } catch (error) {
      console.log("Error auth: ", error.response);
      setMessage(error.response.data.message);
    }
  };

  const userAuthenticated = async () => {
    setIsAuthenticated(false);
    setMessage("");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/auth/isUserAuth`
      );
      if (response.status === 200) {
        setMessage(response.data);
        setIsAuthenticated(true);
        refreshing();
      }
    } catch (error) {
      console.log("Error auth: ", error.response);
      setMessage(error.response.data.message);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/auth/refreshtoken`,
        { refreshToken }
      );
      setMessage(response.data.message);
      console.log(response);
      localStorage.setItem(
        "access_token",
        "Bearer " + response.data.new_access_token
      );
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.new_access_token}`;
    } catch (error) {
      console.log("Error auth: ", error.response);
      setMessage(error.response.data.message);
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
        {!loginStatus && <button onClick={login}>Login</button>}
        {loginStatus && <button onClick={logout}>Logout</button>}
      </div>
      {loginStatus && (
        <div className="btn">
          <button onClick={userAuthenticated}>Check Auth JWT</button>
          <button onClick={refreshToken}>Refresh Token JWT</button>
        </div>
      )}
      <span>{message}</span>
    </div>
  );
};

export default Login;
