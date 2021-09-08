const express = require("express");
const Joi = require("joi");
const { User } = require("../models/users");

const router = express.Router();

const validateUserJoi = (user) => {
  const schema = Joi.object({
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().required().min(8).max(1024).label("Password"),
  });
  const { error } = schema.validate(user);
  return error ? error.details[0].message : error;
};

router.post("/", async (req, res) => {
  // get the user credentials from the request body
  let loginUser = req.body;
  // validate the credentials
  const error = validateUserJoi(loginUser);
  if (error) return res.status(400).send(error);

  // search the database for the user
  const user = await User.findOne({ email: loginUser.email });
  if (!user) return res.status(400).send("Invalid Email or Password");

  if (!(await user.comparePassword(loginUser.password)))
    return res.status(400).send("Invalid Email or Password");
  return res.send(user.generateAuthToken());
});

module.exports = router;
