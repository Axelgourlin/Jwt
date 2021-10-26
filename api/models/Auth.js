const connection = require("../config/db-config");
const Joi = require("joi");
const db = connection.promise();

const validate = (data) => {
  return Joi.object({
    ident: Joi.string().max(254).required(),
    password: Joi.string().max(255).required(),
  }).validate(data, { abortEarly: false }).error;
};

const findUsers = async () => {
  try {
    const users = await db.query("SELECT * FROM user");
    return users[0];
  } catch (error) {
    return Promise.reject(error);
  }
};

const findByIdent = async (ident) => {
  try {
    const user = await db.query("SELECT * FROM user WHERE user_ident = ?", [
      ident,
    ]);
    return user[0][0];
  } catch (error) {
    return Promise.reject(error);
  }
};

const create = async (ident, hashedPassword) => {
  try {
    const response = await db.query(
      "INSERT INTO user (user_ident, user_password) VALUES (?,?)",
      [ident, hashedPassword]
    );
    return response[0];
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  validate,
  findUsers,
  findByIdent,
  create,
};
