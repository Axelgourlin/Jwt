const jwt = require("jsonwebtoken");

const createToken = (userEmail = "", user_id = "") => {
  console.log(userEmail, user_id);
  return jwt.sign(
    { userEmail: userEmail, user_id: user_id },
    process.env.PRIVATE_KEY,
    {
      expiresIn: "1800s",
    }
  );
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("auth", authHeader, "token", token);

  if (token == null)
    return res
      .status(401)
      .json({ auth: false, message: "Baerer Json Web Token is required!" });

  jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
    console.log("decoded:", decoded);
    if (err)
      return res.status(401).json({ auth: false, message: "Wrong Token!" });
    req.userId = decoded.id;
    next();
  });
};

module.exports = { createToken, verifyToken };
