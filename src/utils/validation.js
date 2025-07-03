const validator = require("validator");

const validSignUp = (req) => {
  const { FirstName, LastName, Email, Password } = req.body;
  if (!validator.isEmail(Email)) {
    throw new Error("Invalid email");
  } else if (!validator.isStrongPassword(Password)) {
    throw new Error("Password should be strong");
  }
};

const validateEditProfile = (req) => {
  const allowedFields = [
    "FirstName",
    "LastName",
    "Email",
    "age",
    "Gender",
    "About",
    "photoUrl",
    "Skills",
  ];
  const fields = Object.keys(req.body);
  const isEditAllowed = fields.every((field) => allowedFields.includes(field));
  if (!isEditAllowed) {
    throw new Error("Invalid fields in update");
  }
};

module.exports = { validSignUp, validateEditProfile };
