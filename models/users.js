const bcrypt = require("bcrypt");
const config = require("config");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 255 },
  email: { type: String, required: true, match: /\S+@\S+\.\S+/, unique: true },
  password: { type: String, require: true },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    config.get("authKey")
  );
};

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);

const validateUserJoi = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required().label("Name"),
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().required().min(8).max(1024).label("Password"),
  });
  const { error } = schema.validate(user);
  return error ? error.details[0].message : error;
};

module.exports = { User, validateUserJoi };
