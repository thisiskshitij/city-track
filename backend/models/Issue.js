const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  image_url: {
    type: String
  },

  category: {
    type: String,
    enum: [
      "Road issues",
      "Sanitation problems",
      "Electricity issues",
      "Water supply problems",
      "Environmental issues"
    ],
    required: true
  },

  severity: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low"
  },

  // location: {
  //   latitude: Number,
  //   longitude: Number
  // },

  // new lines for area data
  location: {
    lat: Number,
    lng: Number,
    areaName: String
  },

  upvotes: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Issue", IssueSchema);