const express = require("express");
const Requestrouter = express.Router();
const UserModel = require("../models/user");
const { AdminAuth } = require("../middleware/auth");
// <-- Add this line
const ConnectionRequest = require("../models/connectionRequest");

Requestrouter.post("/send/:status/:toUserid", AdminAuth, async (req, res) => {
  try {
    const fromUserid = req.user._id;
    /**
     * The user ID of the recipient to whom the request is being sent.
     * Retrieved from the route parameters in the request.
     *
     */
    const toUserid = req.params.toUserid;
    const status = req.params.status;
    const allowedStatus = ["ignore", "interested", "accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status type: " + status });
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserid, toUserid },
        { fromUserid: toUserid, toUserid: fromUserid },
      ],
    });

    if (existingConnectionRequest) {
      return res
        .status(409)
        .send({ message: "Connection Request Already Exists!" });
    }

    const toUser = await UserModel.findById(toUserid);
    if (!toUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserid,
      toUserid,
      status,
    });
    await connectionRequest.save();
    res.json({
      message:
        req.user.FirstName +
        " " +
        req.user.LastName +
        " sent a request to " +
        toUser.FirstName,
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
//request id from user id to touser id
//requestId should be valid
Requestrouter.post(
  "/review/:status/:requestId",
  AdminAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserid: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.status(400).json({ message: "connection not found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: `Connection request ${status} successfully.`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = Requestrouter;
