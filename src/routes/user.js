const express = require("express");
const userRouter = express.Router();
const UserModel = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { AdminAuth } = require("../middleware/auth");

userRouter.get("/requests/received", AdminAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserid: loggedInUser._id,
      status: "interested",
    }).populate("fromUserid", "FirstName LastName email skills photoUrl");
    res.json({
      message: "Connection requests fetched successfully",
      requests: connectionRequests,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});
userRouter.get("/connections", AdminAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserid: loggedInUser._id, status: "accepted" },
        { fromUserid: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate(
        "fromUserid toUserid",
        "FirstName LastName email skills photoUrl age Gender About"
      )
      .populate(
        "toUserid",
        "FirstName LastName email skills photoUrl age Gender About"
      );
    console.log(connectionRequests);

    const data = connectionRequests.map((row) => {
      // If the logged-in user is the sender, return the receiver; else, return the sender
      if (row.fromUserid._id.equals(loggedInUser._id)) {
        return row.toUserid;
      }
      return row.fromUserid;
    });
    res.json({
      message: "Connections fetched successfully",
      connections: data,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/feed", AdminAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // Pagination logic
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ toUserid: loggedInUser._id }, { fromUserid: loggedInUser._id }],
    })
      .select("fromUserid toUserid")
      .populate("fromUserid", "FirstName")
      .populate("toUserid", "FirstName");
    const hideUsersFromFeed = new Set(); // contain unique element
    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserid._id.toString());
      hideUsersFromFeed.add(request.toUserid._id.toString());
    });
    const users = await UserModel.find({
      $and: [
        { _id: { $ne: loggedInUser._id } }, // Exclude the logged-in user
        { _id: { $nin: Array.from(hideUsersFromFeed) } }, // Exclude users in connection requests
      ],
    })
      .select("FirstName LastName Email Skills photoUrl age Gender About")
      .skip(skip)
      .limit(limit);
    res.json({ data: users });
    console.log(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = userRouter;
