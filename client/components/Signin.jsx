import { useState } from "react";
import axios from "axios";

const Signin = ({ refreshing }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const singin = async () => {
    const body = { email: email, password: password };
    try {
      const result = await axios.post(
        "http://localhost:4000/auth/signin",
        body
      );
      console.log("result singin: ", result.data);
      if (!result.data.affectedRows) {
        setMessage("Error created account");
      }
      if (result.data.affectedRows === 1) {
        setMessage("Successfully created account");
      }
      refreshing();
      // setResulte(result);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("state signin:", email, password);
  return (
    <div className="container">
      <h2>SignIn</h2>
      <span>{message && message}</span>
      <div className="content-items">
        <label htmlFor="email">Email :</label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="content-items">
        <label htmlFor="password">Password :</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <input type="button" value="SignIn" onClick={singin} />
    </div>
  );
};

export default Signin;
