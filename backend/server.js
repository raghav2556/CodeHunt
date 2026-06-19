// ================= IMPORTS =================
require("dotenv").config();
const cookieParser = require("cookie-parser");
const Groq = require("groq-sdk");
const redis = require("./config/redis");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const {
  loginLimiter,
  signupLimiter,
  otpLimiter,
  verifyOtpLimiter,
  resetPasswordLimiter,
  runLimiter
} = require("./middleware/rateLimit");

const authMiddleware = require("./middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Course = require("./models/Course");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
const Otp = require("./models/Otp");
const Submission = require("./models/Submission");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const passport = require("./config/passport");
const session = require("express-session");
const auth = require("./middleware/auth");

function normalizeOutput(str) {
  if (!str) return "";

  return str
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join("\n")
    .trim();
}

// 🔥 Safe Cleanup
function safeCleanup(file, exe) {
  try {
    if (fs.existsSync(file)) fs.unlinkSync(file);
    if (fs.existsSync(exe)) fs.unlinkSync(exe);
  } catch (err) {
    console.log("Cleanup error:", err);
  }
}


// ================= APP SETUP =================
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// ================= MONGODB =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("MongoDB Error ❌", err));
 
  // ================= OTP =================
  app.post("/send-otp", otpLimiter, async (req, res) => {
    const purpose = req.body.purpose || "signup";
    let { username, email, password } = req.body;

username = username?.trim();
email = email?.trim().toLowerCase();

  try {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email address"
      });
    }

    const existingUser = await User.findOne({ email });

if (purpose === "signup" && existingUser) {
  return res.status(400).json({
    message: "User already exists"
  });
}

if (purpose === "reset" && !existingUser) {
  return res.status(400).json({
    message: "User not found"
  });
}

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await Otp.deleteMany({
  email,
  purpose
});

    await Otp.create({
  email,
  otp,
  purpose,
  expiresAt: new Date(Date.now() + 10 * 60 * 1000)
});

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: email,

      subject: "CodeHunt Email Verification",

      html: `
        <h2>Verify your CodeHunt account</h2>

        <p>Your OTP is:</p>

        <h1>${otp}</h1>

        <p>This code expires in 10 minutes.</p>
      `
    });

    res.json({
      message: "OTP sent successfully"
    });

  } catch {

    res.status(500).json({
      message: "Failed to send OTP"
    });

  }

});

app.post("/verify-otp", verifyOtpLimiter, async (req, res) => {
  const purpose = req.body.purpose || "signup";
  let { email, otp } = req.body;

email = email?.trim().toLowerCase();
otp = otp?.trim();

  try {
    const otpDoc = await Otp.findOne({
  email,
  otp,
  purpose
});

    if (!otpDoc) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    if (otpDoc.expiresAt < new Date()) {

      await Otp.deleteOne({
        _id: otpDoc._id
      });

      return res.status(400).json({
        message: "OTP expired"
      });
    }

    otpDoc.verified = true;

    await otpDoc.save();

    res.json({
      message: "Email verified"
    });

  } catch {

    res.status(500).json({
      message: "OTP verification failed"
    });

  }

});




// ================= AUTH =================
app.post("/signup", signupLimiter, async (req, res) => {
  let { username, email, password } = req.body;

username = username?.trim();
email = email?.trim().toLowerCase();
  try {
   const verifiedOtp = await Otp.findOne({
  email,
  verified: true,
  purpose: "signup"
});

if (!verifiedOtp) {
  return res.status(400).json({
    message: "Please verify your email first"
  });
}

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!username || username.trim().length < 3) {
  return res.status(400).json({
    message:
      "Username must be at least 3 characters"
  });
}

if (username.length > 30) {
  return res.status(400).json({
    message:
      "Username cannot exceed 30 characters"
  });
}

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message:
      "Please enter a valid email address"
  });
}

if (password.length < 8) {
  return res.status(400).json({
    message:
      "Password must be at least 8 characters"
  });
}

if (password.length > 64) {
  return res.status(400).json({
    message:
      "Password cannot exceed 64 characters"
  });
}

    const existingUser = await User.findOne({ email });

if (existingUser) {
  return res.status(400).json({
    message: "User already exists"
  });
}

    const hashed = await bcrypt.hash(password, 10);

    await new User({
      username,
      email,
      password: hashed
    }).save();

    await Otp.deleteMany({
  email,
  purpose: "signup"
});

    res.json({ message: "Signup successful" });

  } catch {
    res.status(500).json({ message: "Signup failed" });
  }
});

app.post("/login", loginLimiter, async (req, res) => {
  let { email, password } = req.body;

email = email?.trim().toLowerCase();
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found , Register first" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",
  maxAge: 24 * 60 * 60 * 1000
});

res.json({
  username: user.username
});

  } catch {
    res.status(500).json({ message: "Login failed" });
  }
});

//Reset Pass
app.post("/reset-password", resetPasswordLimiter, async (req, res) => {

  let {
    email,
    password
  } = req.body;

  email = email?.trim().toLowerCase();

  try {

    const verifiedOtp = await Otp.findOne({
      email,
      verified: true,
      purpose: "reset"
    });

    if (!verifiedOtp) {
      return res.status(400).json({
        message: "Please verify your OTP first"
      });
    }

    if (password.length < 8 ||
        password.length > 64) {

      return res.status(400).json({
        message: "Password must be 8–64 characters"
      });
    }

    const hashed = await bcrypt.hash(
      password,
      10
    );

    await User.updateOne(
      { email },
      { password: hashed }
    );

    await Otp.deleteMany({
      email,
      purpose: "reset"
    });

    res.json({
      message: "Password updated successfully"
    });

  } catch {

    res.status(500).json({
      message: "Password reset failed"
    });

  }

});


//Logout
app.post("/logout", (req, res) => {

  res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax"
});

  res.json({
    message: "Logged out"
  });

});

app.get("/me", auth, async (req, res) => {

  const user = await User.findById(req.user);

  res.json({
    username: user.username,
    email: user.email
  });

});

// ================= GOOGLE AUTH =================
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false
  }),
  (req, res) => {

    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",
  maxAge: 24 * 60 * 60 * 1000
});

res.redirect(`${process.env.CLIENT_URL}/dashboard`);

  }
);

// ================= GITHUB AUTH =================
app.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["user:email"]
  })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    session: false
  }),
  (req, res) => {

    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",
  maxAge: 24 * 60 * 60 * 1000
});

res.redirect(`${process.env.CLIENT_URL}/dashboard`);

  }
);


// ================= SAVE PROGRESS (SECURE) =================
app.post("/save-progress", authMiddleware, async (req, res) => {
  try {
    const { problemKey, xpEarned } = req.body;

    const user = await User.findById(req.user);
    

    if (!problemKey)
      return res.status(400).json({ message: "Invalid problem key" });

    if (!user.progress.get(problemKey)) {
      user.progress.set(problemKey, true);
      user.xp += xpEarned || 0;

      // Streak logic
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!user.lastActiveDate) {
        user.streak = 1;
      } else {
        const last = new Date(user.lastActiveDate);
        last.setHours(0, 0, 0, 0);
        const diff = (today - last) / (1000 * 60 * 60 * 24);

        if (diff === 1) user.streak += 1;
        else if (diff > 1) user.streak = 1;
      }

      user.lastActiveDate = today;
    }

    user.level = Math.floor(user.xp / 100) + 1;

    await user.save();
    

    res.json({
  progress: Object.fromEntries(user.progress),
  xp: user.xp,
  level: user.level,
  streak: user.streak,
  achievements: user.achievements
});

  } catch {
    res.status(500).json({ message: "Save failed" });
  }
});

// ================= SAVE ACHIEVEMENTS =================
app.post("/save-achievements", authMiddleware, async (req, res) => {

  try {

    const { achievements } = req.body;

    const user = await User.findById(req.user);

    user.achievements = achievements;

    await user.save();

    res.json({ success: true });

  } catch (err) {

    res.status(500).json({
      message: "Failed to save achievements"
    });

  }

});


// ================= LOAD PROGRESS =================
app.get("/load-progress", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user);

  res.json({
  progress: Object.fromEntries(user.progress),
  xp: user.xp,
  level: user.level,
  streak: user.streak,
  achievements: user.achievements || []
});
});



// ================= RUN CODE (IMPROVED JUDGE) =================
app.post("/run", authMiddleware, runLimiter, async (req, res) => {

  const { code, testCases, problemKey } = req.body;

  const id = Date.now();
  const fileName = `temp_${id}.cpp`;
  const exeName = `temp_${id}.exe`;

  try {

    fs.writeFileSync(fileName, code);

    // ===== COMPILE =====
   const compile = await new Promise((resolve) => {

  console.log("Compiling:", fileName);

  const compiler = spawn("g++", [
    fileName,
    "-o",
    exeName
  ]);

  let stderr = "";

  const timeout = setTimeout(() => {
    compiler.kill();

    resolve({
      success: false,
      error: "Compilation timed out"
    });
  }, 30000);

  compiler.stderr.on("data", (data) => {
    stderr += data.toString();
  });

  compiler.on("close", (code) => {

    clearTimeout(timeout);

    if (code !== 0) {

      resolve({
        success: false,
        error: stderr || "Compilation failed"
      });

    } else {

      console.log("Compile Success");

      resolve({
        success: true
      });

    }

  });

});

    if (!compile.success) {

      try {
        await Submission.create({
          userId: req.user,
          problemKey,
          code,
          status: "Compile Error"
        });
      } catch (err) {
        console.log("Submission save error:", err);
      }

      safeCleanup(fileName, exeName);

      return res.json({ error: compile.error });
    }


    const results = [];

    // ===== RUN TESTS =====
    for (let i = 0; i < testCases.length; i++) {

      const test = testCases[i];

      try {

        const output = await new Promise((resolve, reject) => {

          const executable = spawn(path.resolve(exeName));

let stdout = "";
let stderr = "";

const timeout = setTimeout(() => {
  executable.kill();
  reject(new Error("Time Limit Exceeded"));
}, 3000);

executable.stdout.on("data", (data) => {
  stdout += data.toString();
});

executable.stderr.on("data", (data) => {
  stderr += data.toString();
});

executable.on("close", (code) => {

  clearTimeout(timeout);

  if (code !== 0) {
    return reject(new Error(stderr || "Runtime Error"));
  }

  resolve(stdout);
});

executable.stdin.write(test.input || "");
executable.stdin.end();

        });

        const normalizedUser = normalizeOutput(output);
        const normalizedExpected = normalizeOutput(test.expected);

        results.push({
          input: test.input,
          expected: test.expected,
          output: normalizedUser,
          passed: normalizedUser === normalizedExpected
        });

      } catch (err) {

        results.push({
          input: test.input,
          expected: test.expected,
          output: err.message || "Runtime Error",
          passed: false
        });

      }

    }


    // ===== DETERMINE STATUS =====
    let status = "Wrong Answer";

    const allPassed = results.every(r => r.passed);

    if (allPassed) status = "Accepted";

    if (results.some(r => r.output === "Runtime Error")) {
      status = "Runtime Error";
    }


    // ===== SAVE SUBMISSION =====
    try {

      await Submission.create({
        userId: req.user,
        problemKey,
        code,
        status
      });

    } catch (err) {

      console.log("Submission save error:", err);

    }


    safeCleanup(fileName, exeName);

    res.json({ results });

  } catch (err) {

    console.log("Judge error:", err);

    safeCleanup(fileName, exeName);

    res.json({
      results: [{
        input: "",
        expected: "",
        output: "Server Error",
        passed: false
      }]
    });

  }

});


app.post("/hint", authMiddleware, async (req, res) => {
  try {
    const { code, problem, failedTest, mode } = req.body;

    const systemPrompt = `
You are an expert C++ mentor.

Rules:
- NEVER provide full solution
- NEVER rewrite full corrected code
- Keep answer under 120 words
- Encourage logical thinking
- Only provide guidance
`;

    let userPrompt = "";

    if (mode === "start") {
      userPrompt = `
Student is stuck at beginning.

Problem:
Title: ${problem.title}
Description: ${problem.description}

Give a starting hint about:
- What concept to use
- First logical step

Do NOT reveal full approach.
`;
    }

    if (mode === "debug") {
      userPrompt = `
Student attempted but failed test case.

Problem:
Title: ${problem.title}
Description: ${problem.description}

Student Code:
${code}

Failed Test Case:
Input: ${failedTest?.input}
Expected: ${failedTest?.expected}
Output: ${failedTest?.output}

Explain likely logical mistake.
Do NOT give corrected code.
`;
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3
    });

    res.json({
      hint: completion.choices[0].message.content
    });

  } catch (error) {
    console.log(error);
    res.json({
      hint: "Think carefully about the problem requirements."
    });
  }
});

app.post("/save-code", authMiddleware, async (req, res) => {

  const { problemKey, code } = req.body;

  const user = await User.findById(req.user);

  if (!user.codeMap) {
  user.codeMap = new Map();
}

user.codeMap.set(problemKey, code);

  await user.save();

  res.json({ success: true });

});

app.get("/load-code", authMiddleware, async (req, res) => {

  const user = await User.findById(req.user);

  res.json({
    codeMap: Object.fromEntries(user.codeMap || {})
  });

});

app.get("/course/:slug", async (req, res) => {

  try {

    const course = await Course.findOne({ slug: req.params.slug });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);

  } catch (err) {
    res.status(500).json({ message: "Failed to load course" });
  }

});

app.get("/submissions/:problemKey", authMiddleware, async (req, res) => {

  const submissions = await Submission.find({
    userId: req.user,
    problemKey: req.params.problemKey
  })
  .sort({ createdAt: -1 })
  .limit(20);

  res.json(submissions);

});

/*app.use(
  express.static(
    path.join(__dirname, "../frontend/dist")
  )
);

app.get("*", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "../frontend/dist",
      "index.html"
    )
  );
});*/

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

