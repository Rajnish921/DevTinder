const express = require("express");
const connectDb = require("./config/database");
const app = express();
const UserModel = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { AdminAuth } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const requestRoutes = require("./routes/request");
const userRoutes = require("./routes/user");
const { validSignup } = require("./utils/validation");

const cors = require("cors");
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // replace with your frontend URL
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/request", requestRoutes);
app.use("/user", userRoutes);

// app.post("/signup", async (req, res) => {
//   try {
//     validSignup(req);
//     // const { FirstName, LastName, Email, Password } = req.body;
//     // const user = new UserModel({ FirstName, LastName, Email, Password });
//     const { FirstName, LastName, Email, Password } = req.body;

//     const passwordHash = await bcrypt.hash(Password, 10);
//     // user.Password = passwordHash;
//     const user = new UserModel({
//       FirstName,
//       LastName,
//       Email,
//       Password: passwordHash,
//     });

//     await user.save();
//     res.status(201).send({ message: "User created successfully", user });
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });

// app.get("/User", async (req, res) => {
//   try {
//     const userEmail = req.body.Email;
//     const user = await UserModel.findOne({ Email: userEmail });
//     if (!user) {
//       return res.status(404).send("user not found");
//     }
//     res.send(user);
//   } catch (error) {
//     res.status(500).send("server issue");
//   }
// });

// app.get("/feed", async (req, res) => {
//   try {
//     const users = await UserModel.find({});
//     res.send(users);
//   } catch (error) {
//     res.status(400).send("Something went wrong");
//   }
// });

// app.patch("/user/:id", async (req, res) => {
//   const userId = req.params?.id;
//   const data = req.body;

//   try {
//     const ALLOWED_UPDATES = [
//       "userId",
//       "photoUrl",
//       "about",
//       "gender",
//       "age",
//       "skills",
//     ];
//     const updates = Object.keys(data);
//     const isValidOperation = updates.every((key) =>
//       ALLOWED_UPDATES.includes(key)
//     );
//     if (!isValidOperation) {
//       throw new Error("Invalid updates");
//       if (data?.skills.length > 5) {
//         throw new Error("Skills should be less than 5");
//       }
//     }
//     const user = await UserModel.findByIdAndUpdate(userId, data, {
//       runValidators: true,
//       returnDocument: "after",
//     });
//     if (!user) {
//       return res.status(404).send("user not found");
//     }
//   } catch (error) {
//     res.status(500).send("server issue");
//   }
// });

// app.post("/sendConnectionRequest", AdminAuth, async (req, res) => {
//   const user = req.user;
//   console.log("sendConnectionRequest called");
//   res.send("user.FirstNmae + send a connection request to you");
// });

app.get("/", (req, res) => {
  res.send("API is running!");
});

connectDb()
  .then(() => {
    console.log("database connected successfully");
    app.listen(5000, () => {
      console.log("server is running on port 5000");
    });
  })
  .catch((error) => {
    console.log("database connection failed", error.message);
  });
