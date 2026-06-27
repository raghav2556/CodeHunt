require("dotenv").config();

const { Worker } = require("bullmq");

const bullRedis = require("../config/bullRedis");
const transporter = require("../config/transporter");
const emailTemplate = require("../templates/emailTemplate");

const worker = new Worker(
  "emailQueue",

  async (job) => {

    if (job.name === "send-otp") {

      const { email, otp, purpose } = job.data;

      const title =
        purpose === "reset"
          ? "CodeHunt Password Reset"
          : "CodeHunt Email Verification";

      const html = emailTemplate({

  title,

  heading:
    purpose === "reset"
      ? "Reset Your Password"
      : "Verify Your Email",

  description:
    purpose === "reset"
      ? "Use the verification code below to securely reset your CodeHunt account password."
      : "Welcome to CodeHunt! Use the verification code below to complete your account registration.",

  otp,

  expiry: "10 minutes"

});

await transporter.sendMail({

  from: process.env.EMAIL_USER,

  to: email,

  subject: title,

  html

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