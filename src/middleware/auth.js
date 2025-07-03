const AdminAuth = (req, res, next) => {
  console.log("authorized user");
  const token = "rajn";
  const AdminAuthorized = token === "rajn";
  if (!AdminAuthorized) {
    return res.status(401).send("unauthorized user");
  } else {
    next();
  }
};

module.exports = {
  AdminAuth,
};
