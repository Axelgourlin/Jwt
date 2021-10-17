const argon2 = require("argon2");

const hashPassword = (password) => {
  return argon2.hash(password);
};

const verifyPassword = (password, hashedPassword) => {
  return argon2.verify(hashedPassword, password);
};

module.exports = { hashPassword, verifyPassword };
