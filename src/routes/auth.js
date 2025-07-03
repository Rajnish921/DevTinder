const express = require("express");
const Authrouter = express.Router();
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validSignUp } = require("../utils/validation");
const { AdminAuth } = require("../middleware/auth");

Authrouter.post("/signup", async (req, res) => {
  try {
    validSignUp(req);
    const { FirstName, LastName, Email, Password, Gender, age } = req.body; // <-- add Gender and age
    const passwordHash = await bcrypt.hash(Password, 10);
    const user = new UserModel({
      FirstName,
      LastName,
      Email,
      Password: passwordHash,
      Gender, // <-- add Gender
      age, // <-- add age
    });

    const SaveUser = await user.save();
    const token = await SaveUser.getJWT();
    // set the token in cookie
    res.cookie("token", token);
    res.json({ message: "User created successfully", data: SaveUser });
    // res
    //   .status(201)
    //   .send({ message: "User created successfully", user: SaveUser });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

Authrouter.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await UserModel.findOne({ Email: Email });
    if (!user) {
      return res.status(404).send("user not found");
    }
    const isValidPassword = await user.validatePassword(Password); // compare the password with the hashed password
    if (isValidPassword) {
      const token = await user.getJWT();
      // set the token in cookie
      res.cookie("token", token);
      res.send(user);
    } else {
      return res.status(401).send("Invalid password");
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
Authrouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", "null", {
      expires: new Date(Date.now()),
    });
    res.send();
  } catch (error) {
    res.status(500).send({ error: "Logout failed" });
  }
});

module.exports = Authrouter;
