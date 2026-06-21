require("dotenv").config();

const { Worker } = require("bullmq");

const bullRedis = require("../config/bullRedis");
const transporter = require("../config/transporter");

const worker = new Worker(
  "emailQueue",

  async (job) => {

    if (job.name === "send-otp") {

      const { email, otp, purpose } = job.data;

      const title =
        purpose === "reset"
          ? "CodeHunt Password Reset"
          : "CodeHunt Email Verification";

      await transporter.sendMail({
        from: process.env.EMAIL_USER,

        to: email,

        subject: title,

        html: `
          <h2>${title}</h2>

          <p>Your OTP is:</p>

          <h1>${otp}</h1>

          <p>This code expires in 10 minutes.</p>
        `
      });

    }

  },

  {
    connection: bullRedis
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});