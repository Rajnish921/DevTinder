const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //reference to User model collection
      required: true,
    },
    toUserid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //reference to User model collection
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: "{VALUE} is not a valid status",
      },
    },
  },
  { timestamps: true }
);
connectionRequestSchema.index({ fromUserid: 1, toUserid: 1 });
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // Check if fromUserid is the same as toUserid
  if (connectionRequest.fromUserid.equals(connectionRequest.toUserid)) {
    return next(new Error("Cannot send connection request to yourself!"));
  }
  next();
});
const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
