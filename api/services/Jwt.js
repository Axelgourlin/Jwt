const jwt = require("jsonwebtoken");

const createToken = (userEmail = "", user_id = "") => {
  return jwt.sign(
    { userEmail: userEmail, user_id: user_id },
    process.env.PRIVATE_KEY,
    {
      expiresIn: "36000s",
    }
  );
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && JSON.parse(authHeader.split(" ")[1]);
  console.log("token split", token);

  if (token == null)
    return res
      .status(401)
      .json({ auth: false, message: "Baerer Json Web Token is required!" });

  jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
    console.log(token, process.env.PRIVATE_KEY, "decoded:", decoded);
    if (err) {
      return res
        .status(401)
        .json({ auth: false, message: "Wrong Token/Token expired!" });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = {
  createToken,
  verifyToken,
};
