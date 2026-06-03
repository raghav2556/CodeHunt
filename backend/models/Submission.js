const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  problemKey: {
    type: String,
    required: true
  },

  code: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["Accepted", "Wrong Answer", "Runtime Error" , "Compile Error"],
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);