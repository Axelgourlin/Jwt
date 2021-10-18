import { useState } from "react";
import axios from "axios";

const Signin = () => {
  const [ident, setIdent] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const singin = async (e) => {
    e.preventDefault();
    const body = { ident: ident, password: password };
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
        setTimeout(() => {
          setMessage("");
          setIdent("");
          setPassword("");
        }, 4000);
      }
    } catch (error) {
      console.log(error);
      setMessage(error.response.data.message);
    }
  };

  return (
    <form className="container" onSubmit={(e) => singin(e)}>
      <h2>SignIn</h2>
      <div className="content-items">
        <label htmlFor="ident">Identifier :</label>
        <input
          type="ident"
          name="ident"
          id="ident"
          required
          onChange={(e) => setIdent(e.target.value)}
          value={ident}
        />
      </div>
      <div className="content-items">
        <label htmlFor="password">Password :</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      <input type="submit" value="SignIn" />
      <span>{message}</span>
    </form>
  );
};

export default Signin;
