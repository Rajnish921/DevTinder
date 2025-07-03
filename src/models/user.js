const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20, // fixed typo
    },
    LastName: {
      type: String,
    },
    Email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true, // fixed typo
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email " + value);
        }
      },
    },
    Password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 16,
      max: 100,
    },
    Gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          // fixed typo
          throw new Error("Gender not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://www.w3schools.com/howto/img_avatar.png",
    },
    About: {
      type: String,
      default: "default about user(tinder)",
    },
    Skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputbyUser) {
  const user = this;
  const passwordHash = user.Password;
  const isValidPassword = await bcrypt.compare(
    passwordInputbyUser,
    passwordHash
  );
  return isValidPassword;
};

// Model name must be "User" (capitalized) to match ref in other schemas
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
