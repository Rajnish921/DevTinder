const mongoose = require("mongoose");
const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://rajnishkumar18at:Rajnish%40123@nmastenode.vhtufzl.mongodb.net/helloworld"
  );
};
module.exports = connectDb;
// connectDb()
//   .then(() => {
//     console.log("database connected successfully");
//   })
//   .catch((error) => {
//     console.log("database connection failed", error.message);
//   });
