import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { Context } from "../context/Context";

const Login = ({ setLoginStatus }) => {
  const [ident, setIdent] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { dispatch, access_token } = useContext(Context);

  const login = async () => {
    try {
      const body = { ident: ident, password: password };
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/auth/login`,
        body
      );
      if (response.data.access_token) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data.access_token,
        });
        console.log("coucou", response.data);

        setLoginStatus(true);
        setMessage("Connected !");
      }
    } catch (error) {
      console.log("Error login: ", error.response);
      setMessage(error.response.data.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    delete axios.defaults.headers.common["Authorization"];
    setMessage("");
    dispatch({ type: "LOGOUT" });
  };

  // const userAuthenticated = async () => {
  //   setIsAuthenticated(false);
  //   setMessage("");
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_URL}/auth/isUserAuth`
  //     );
  //     if (response.status === 200) {
  //       setMessage(response.data);
  //       setIsAuthenticated(true);
  //       refreshing();
  //     }
  //   } catch (error) {
  //     console.log("Error auth: ", error.response);
  //     setMessage(error.response.data.message);
  //   }
  // };

  return (
    <div className="container">
      <h2>Login</h2>
      <div className="content-items">
        <label htmlFor="loginident">Identifier :</label>
        <input
          type="ident"
          name="loginident"
          id="loginident"
          onChange={(e) => setIdent(e.target.value)}
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
        {!access_token && <button onClick={login}>Login</button>}
        {access_token && <button onClick={logout}>Logout</button>}
      </div>
      <Link to="/secure">Secure Page</Link>
      <span>{message}</span>
    </div>
  );
};

export default Login;
