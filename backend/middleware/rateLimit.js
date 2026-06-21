const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");

const redis = require("../config/redis");

const createLimiter = ({
  windowMs,
  max,
  message
}) => {
  return rateLimit({
    windowMs,
    max,

    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
      sendCommand: (...args) =>
        redis.call(...args)
    }),

    message: {
      message
    }
  });
};

const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message:
    "Too many login attempts. Please try again in 15 minutes."
});

const signupLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message:
    "Too many signup attempts. Please try again later."
});

const signupOtpLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message:
    "Too many signup OTP requests. Please try again in 10 minutes."
});

const resetOtpLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message:
    "Too many password reset OTP requests. Please try again in 10 minutes."
});

const verifyOtpLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message:
    "Too many OTP verification attempts. Please try again later."
});

const resetPasswordLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message:
    "Too many password reset attempts. Please try again later."
});

const runLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 60,
  message:
    "Code execution limit reached. Please wait a minute."
});

module.exports = {
  loginLimiter,
  signupLimiter,
  signupOtpLimiter,
  resetOtpLimiter,
  verifyOtpLimiter,
  resetPasswordLimiter,
  runLimiter
};