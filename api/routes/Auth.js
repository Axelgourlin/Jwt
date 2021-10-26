const authRouter = require("express").Router();
const Auth = require("../models/auth");
const { hashPassword, verifyPassword } = require("../services/argon2");
const { createToken, verifyToken } = require("../services/Jwt");

authRouter.post("/signin", async (req, res) => {
  const { ident, password } = req.body;
  try {
    const user = await Auth.findByIdent(ident);
    if (user) throw new Error("DUPLICATA");
    const hashedPassword = await hashPassword(password);
    const results = await Auth.create(ident, hashedPassword);
    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    if (error.message === "INVALID_FORMAT")
      return res
        .status(401)
        .json({ auth: false, message: "Invalid format credentials" });
    return res.status(500).json(error);
  }
});

authRouter.post("/login", async (req, res) => {
  const { ident, password } = req.body;
  try {
    const user = await Auth.findByIdent(ident);
    if (!user || user.length <= 0) throw new Error("WRONG_CREDENTIALS");
    const verifyedPassword = await verifyPassword(user.user_password, password);
    if (verifyedPassword) {
      const access_token = createToken(ident, user.id);

      return res.status(200).json({
        access_token: access_token,
      });
    } else throw new Error("WRONG_CREDENTIALS");
  } catch (error) {
    console.log("log error", error);
    if (error.message === "DUPLICATA")
      return res
        .status(401)
        .json({ auth: false, message: "Identifier alrdeady existes" });
    if (error.message === "WRONG_CREDENTIALS")
      return res
        .status(401)
        .json({ auth: false, message: "Wrong credentials" });
    else if (error.message === "INVALID_FORMAT")
      return res
        .status(401)
        .json({ auth: false, message: "Invalid format credentials" });
    return res.status(500).json({ auth: false, message: error });
  }
});

authRouter.get("/isUserAuth", verifyToken, async (req, res) => {
  try {
    return res.status(200).json(true);
  } catch (error) {
    return res.status(500).json(false);
  }
});

module.exports = authRouter;
