

"use strict";
const mongoose = require("mongoose");
const user = mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: false, trim: true },
  phoneNo: { type: String, required: false, trim: true },
  socialLoginId: { type: String, required: false, },
  gender: {
    type: String,
    enum: {
      values: ["male", "female"],
      messages: "Please enter value Male or female",
    },
  },
  password: { type: String, required: false },
  language: { type: String, required: false },
  socialLinkId: { type: String, required: false, default: "" },
  platform: { type: String, required: false, default: "" },
  otp: { type: Number, required: false, trim: true, default: "" },
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive"],
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", 'employee'],
  },
  avatar: { type: String, default: "" },
  location: {
    type: {
      type: String,
    },
    coordinates: [Number],
  },
  deviceToken: { type: String, default: "" }
}, { timestamps: true });

user.index({ location: "2dsphere" });
mongoose.model("user", user);
module.exports = user;
