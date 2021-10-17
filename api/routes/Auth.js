const authRouter = require("express").Router();
const Auth = require("../models/auth");
const { hashPassword, verifyPassword } = require("../services/argon2");
const { createToken, verifyToken } = require("../services/Jwt");

authRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const results = await Auth.create(email, hashedPassword);
    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Auth.findByEmail(email);
    if (!user) throw new Error("WRONG_CREDENTIALS");
    const verifyedPassword = await verifyPassword(user.user_password, password);
    if (!verifyedPassword) throw new Error("WRONG_CREDENTIALS");
    const accessToken = createToken(email, user.id);

    return res.status(200).json({
      auth: true,
      accessToken: accessToken,
      result: { id: user.id, email: user.user_email },
    });
  } catch (error) {
    console.log("log error", error);
    if (error.message === "WRONG_CREDENTIALS")
      return res
        .status(404)
        .json({ auth: false, message: "Wrong credentials" });
    else return res.status(500).json({ auth: false, message: error });
  }
});

authRouter.get("/isUserAuth", verifyToken, async (req, res) => {
  try {
    return res.status(200).json("You are Authenticated!");
  } catch (error) {
    return res.status(500).json({ auth: false, message: "Wrong token" });
  }
});

authRouter.get("/", verifyToken, async (req, res) => {
  try {
    const results = await Auth.findUsers();
    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
module.exports = authRouter;
