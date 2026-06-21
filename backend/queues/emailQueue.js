const { Queue } = require("bullmq");

const bullRedis = require("../config/bullRedis");

const emailQueue = new Queue("emailQueue", {
  connection: bullRedis
});

module.exports = emailQueue;