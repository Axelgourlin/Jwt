const argon2 = require("argon2");

const hashPassword = async (password) => {
  try {
    return await argon2.hash(password);
  } catch (err) {
    return new Error(err.message);
  }
};

const verifyPassword = async (password, hashedPassword) => {
  try {
    return await argon2.verify(hashedPassword, password);
  } catch (err) {
    return new Error(err.message);
  }
};

module.exports = { hashPassword, verifyPassword };
