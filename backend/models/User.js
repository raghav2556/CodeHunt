const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: function () {
    return !this.googleId && !this.githubId;}
    },
    googleId: String,
    githubId: String,
    provider: String,

    xp: {
      type: Number,
      default: 0
    },

    level: {
      type: Number,
      default: 1
    },

    streak: {
      type: Number,
      default: 0
    },

    lastActiveDate: {
      type: Date,
      default: null
    },

    progress: {
      type: Map,
      of: Boolean,
      default: {}
    },
    codeMap: {
  type: Map,
  of: String,
  default: {}
},
achievements: {
  type: [String],
  default: []
}
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);