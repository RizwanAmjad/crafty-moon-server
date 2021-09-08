const express = require("express");

const { User, validateUserJoi } = require("../models/users");

const router = express.Router();

router.post("/", async (req, res) => {
  // get the new user info from the req body
  let user = req.body;
  //valdate the user
  const error = validateUserJoi(user);
  if (error) return res.status(400).send(error);

  // check to see if this email is already registered
  const isAlreadyRegistered = await User.findOne({ email: user.email });
  if (isAlreadyRegistered)
    return res.status(400).send("User already Registered.");

  // create and save mongoose object
  try {
    user = new User(user);
    user = await user.save();
    return res.send(user.generateAuthToken());
  } catch {
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
