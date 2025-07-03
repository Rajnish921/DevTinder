const express = require("express");
const Profilerouter = express.Router();
const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const { AdminAuth } = require("../middleware/auth");
const { validateEditProfile, validSignup } = require("../utils/validation");

// Profilerouter.get("/", AdminAuth, async (req, res) => {
//   try {
//     const user = req.user;
//     if (!user) {
//       return res.status(404).send("User does not exist");
//     }
//     res.send(user);
//   } catch (err) {
//     res.status(400).send("ERROR: " + err.message);
//   }
// });
Profilerouter.get("/view", AdminAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).send("User does not exist");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

Profilerouter.patch("/edit", AdminAuth, async (req, res) => {
  try {
    // if (!validateEditProfile(req)) {
    //   throw new Error("Invalid request body");
    // }
    validateEditProfile(req);
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.FirstName} ${loggedInUser.LastName} profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    return res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = Profilerouter;
