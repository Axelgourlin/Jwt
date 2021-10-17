import { useState } from "react";
import axios from "axios";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const singin = async () => {
    const body = { email: email, password: password };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/auth/signin`,
        body
      );
      console.log(response);
      if (!response.data.affectedRows) {
        setMessage("Error creating account");
      }
      if (response.data.affectedRows === 1) {
        setMessage("Successfully created account");
      }
    } catch (error) {
      console.log(error);
      setMessage("Error creating account");
    }
  };

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
      <button onClick={singin}>SignIn</button>
    </div>
  );
};

export default Signin;
