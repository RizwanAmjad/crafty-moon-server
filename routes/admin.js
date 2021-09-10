const Joi = require("joi");
const express = require("express");

const { Admin, validateAdminJoi } = require("../models/admin");

const router = express.Router();

const validateAdminLoginJoi = (user) => {
  const schema = Joi.object({
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().required().min(8).max(1024).label("Password"),
  });
  const { error } = schema.validate(user);
  return error ? error.details[0].message : error;
};

router.post("/", async (req, res) => {
  // get the admin from request body
  let admin = req.body;
  // validate the admin
  const error = validateAdminJoi(admin);
  if (error) return res.status(400).send(error);
  // check if the admin already exists
  const isAlreadyRegistered = await Admin.findOne({ email: admin.email });
  if (isAlreadyRegistered)
    return res.status(400).send("Admin already Registered.");

  // create the new admin
  admin = new Admin(admin);
  try {
    // save the admin into database
    admin = await admin.save();
    return res.send(admin.generateAuthToken());
  } catch {
    return res.status(500).send("Server Error");
  }
});

router.post("/login", async (req, res) => {
  // get the credentials from the body
  let loginAdmin = req.body;
  // validate the request
  const error = validateAdminLoginJoi(loginAdmin);
  if (error) return res.status(400).send(error);
  // get the admin with same email
  const admin = await Admin.findOne({ email: loginAdmin.email });
  // if admin is not found
  if (!admin) return res.status(400).send("Invalid Email or Password");
  // if admin is found then compare password
  if (!(await admin.comparePassword(loginAdmin.password)))
    return res.status(400).send("Invalid Email or Password");
  return res.send(admin.generateAuthToken());
});

module.exports = router;
