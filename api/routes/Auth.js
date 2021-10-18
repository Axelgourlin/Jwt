const authRouter = require("express").Router();
const Auth = require("../models/auth");
const { hashPassword, verifyPassword } = require("../services/argon2");
const {
  createToken,
  CreateRefreshToken,
  refreshToken,
  verifyToken,
} = require("../services/Jwt");

authRouter.post("/signin", async (req, res) => {
  const { ident, password } = req.body;
  let validationErrors = null;
  try {
    const user = await Auth.findByIdent(ident);
    if (user) throw new Error("DUPLICATA");
    validationErrors = Auth.validate(req.body);
    if (validationErrors) throw new Error("INVALID_FORMAT");
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
  let validationErrors = null;
  try {
    validationErrors = Auth.validate(req.body);
    if (validationErrors) throw new Error("INVALID_FORMAT");
    const user = await Auth.findByIdent(ident);
    if (!user || user.length <= 0) throw new Error("WRONG_CREDENTIALS");
    const verifyedPassword = await verifyPassword(user.user_password, password);
    if (!verifyedPassword) throw new Error("WRONG_CREDENTIALS");
    const access_token = createToken(ident, user.id);
    const refresh_token = CreateRefreshToken(ident, user.id);
    await Auth.storageToken(refresh_token, ident);

    return res.status(200).json({
      auth: true,
      access_token: access_token,
      refresh_token: refresh_token,
      result: { id: user.id, ident: user.user_ident },
    });
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

authRouter.post("/refreshtoken", async (req, res) => {
  const token = req.body.refreshToken;
  if (token == null) return res.status(401).json("Token is null");
  const response = await Auth.findToken(token);
  if (!response.refresh_token) return res.status(401).json("Error server");
  const new_access_token = refreshToken(token);
  if (!new_access_token) return res.status(403).json("Error refreshing token");
  res
    .status(201)
    .json({ new_access_token: new_access_token, message: "Token Refreshed !" });
});

authRouter.post("/logout", async (req, res) => {
  const token = req.body.token;
  const response = await Auth.clearToken(token);
  if (response.affectedRows !== 1)
    return res.status(500).json("Error delete token");
  return res.sendStatus(204);
});

module.exports = authRouter;
