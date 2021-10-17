const connection = require("../config/db-config");
const Joi = require("joi");
const db = connection.promise();

const validate = (data, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return Joi.object({
    email: Joi.string().email().max(254).presence(presence),
    password: Joi.string().max(255).presence(presence),
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

const findByEmail = async (email) => {
  try {
    const user = await db.query("SELECT * FROM user WHERE user_email = ?", [
      email,
    ]);
    return user[0][0];
  } catch (error) {
    return Promise.reject(error);
  }
};

const create = async (email, hashedPassword) => {
  try {
    const response = await db.query(
      "INSERT INTO user (user_email, user_password) VALUES (?,?)",
      [email, hashedPassword]
    );
    return response[0];
  } catch (error) {
    return Promise.reject(error);
  }
};

const storageToken = async (token, user_email) => {
  try {
    const response = await db.query(
      "UPDATE user SET refresh_token = ? WHERE user_email = ?",
      [token, user_email]
    );
    return response[0];
  } catch (error) {
    return Promise.reject(error);
  }
};

const findToken = async (token) => {
  try {
    const response = await db.query(
      "SELECT refresh_token FROM user WHERE refresh_token = ?",
      [token]
    );
    return response[0][0];
  } catch (error) {
    return Promise.reject(error);
  }
};

const clearToken = async (token) => {
  try {
    const response = await db.query(
      "UPDATE user SET refresh_token = ? WHERE refresh_token = ?",
      ["", token]
    );
    return response[0];
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  validate,
  findUsers,
  findByEmail,
  findToken,
  create,
  storageToken,
  clearToken,
};
