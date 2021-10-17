import { useState } from "react";
import axios from "axios";

const Login = ({ setLoginStatus, loginStatus }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const body = { email: email, password: password };
      const response = await axios.post(
        "http://localhost:4000/auth/login",
        body
      );
      console.log("result login: ", response.data);
      if (response.data.auth) {
        localStorage.setItem(
          "acces_token",
          "Bearer " + response.data.accessToken
        );
        console.log("coucou", response.data.accessToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
        setLoginStatus(true);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const userAuthenticated = async () => {
    try {
      const response = await axios.get("http://localhost:4000/auth/isUserAuth");
      console.log("res auth:", response);
    } catch (error) {
      console.log("error auth:", error.response);
    }
  };

  console.log("state login:", email, password);
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
      <input type="button" value="Login" onClick={login} />
      {loginStatus && (
        <button onClick={userAuthenticated}>Check Authentication JWT</button>
      )}
    </div>
  );
};

export default Login;
