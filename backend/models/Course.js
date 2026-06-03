const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String,   // ADD THIS
  xp: Number,
  testCases: [
    {
      input: String,
      expected: String
    }
  ]
});

const topicSchema = new mongoose.Schema({
  topicName: String,
  notes: String,
  problems: [problemSchema]
});

const courseSchema = new mongoose.Schema({
  title: String,
  slug: String,
  topics: [topicSchema]
});

module.exports = mongoose.model("Course", courseSchema);