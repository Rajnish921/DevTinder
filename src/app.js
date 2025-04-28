const express = require("express");
const app = express();

app.use((req, res) => {
  res.send("helloo server");
});
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
