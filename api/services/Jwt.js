const jwt = require("jsonwebtoken");

let refreshTokenTabs = [];

const StorageToken = (userToken) => {
  if (!refreshTokenTabs.includes(userToken)) {
    refreshTokenTabs.push(userToken);
  }
};

const deleteToken = (userToken) => {
  refreshTokenTabs = refreshTokenTabs.filter((token) => token !== userToken);
};

const createToken = (userEmail = "", user_id = "") => {
  return jwt.sign(
    { userEmail: userEmail, user_id: user_id },
    process.env.PRIVATE_KEY,
    {
      expiresIn: "5s",
    }
  );
};

function CreateRefreshToken(userEmail = "", user_id = "") {
  return jwt.sign(
    { userEmail: userEmail, user_id: user_id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1y" }
  );
}

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return res
      .status(401)
      .json({ auth: false, message: "Baerer Json Web Token is required!" });

  jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ auth: false, message: "Wrong Token/Token expired!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const refreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return false;
    }
    const access_token = createToken({
      userEmail: decoded.userEmail,
      user_id: decoded.user_id,
    });
    return access_token;
  });
};

module.exports = {
  createToken,
  CreateRefreshToken,
  refreshToken,
  verifyToken,
  StorageToken,
  deleteToken,
};
