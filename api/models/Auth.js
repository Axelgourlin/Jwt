const connection = require("../db-config");
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
    console.log(users);
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
    console.log("findEmail", user[0]);
    return user[0];
  } catch (error) {
    return Promise.reject(error);
  }
};

const create = async (email, hashedPassword) => {
  try {
    return await db.query(
      "INSERT INTO user (user_email, user_password) VALUES (?,?)",
      [email, hashedPassword]
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = { validate, findUsers, findByEmail, create };
