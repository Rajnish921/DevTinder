const express = require("express");
const app = express();

// app.use()
// app.use("/user", [
//   (req, res, next) => {
//     console.log("middleware 1");
//     res.send("hello user");
//     next();
//   },
//   (req, res) => {
//     res.send("hello user 2");
//   },
// ]);

// app.use("/raj",(req,res,next)=>{
//   console.log("1st middleware");
//   next();
// },
// (req,res,next)=>{
//   console.log("2nd middleware");

// }

// app.use("/test", (req, res) => {
//   res.send("he");
// });

// app.put("/tech", (req, res) => {
//   res.send("Rajnish kumar");
// });

// app.use((req, res) => {
//   res.send("helloo server");
// });

const { AdminAuth } = require("./middleware/auth");
app.use("/admin", AdminAuth);

app.get("/admin", (req, res) => {
  res.send("send data");
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
