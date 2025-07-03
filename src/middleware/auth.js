const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const UserModel = require("../models/user");

// const AdminAuth = (req, res, next) => {
//   try {
//     const token = req.cookies;
//     if (!token || !token.adminToken) {
//       throw new Error("token not valid");
//     }
//     const DecodeObj = jwt.verify("token", "rajnish@123");
//     const { _id } = DecodeObj;

//     const user = UserModel.findOne({ _id });
//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(500).send({ error: error.message });
//   }
// };
const AdminAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("login again");
    }
    const DecodeObj = jwt.verify(token, "DEV@Tinder$790");
    const { _id } = DecodeObj;

    const user = await UserModel.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
};

module.exports = {
  AdminAuth,
  cookieParser,
};
