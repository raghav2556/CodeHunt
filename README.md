# 🚀 CodeHunt

> Hunt. Level Up. Master C++.

CodeHunt is a full-stack coding academy platform designed to help beginners learn C++ through a structured, gamified, and AI-assisted experience. Unlike traditional coding platforms that focus only on problem solving, CodeHunt combines guided notes, progressive learning stages, coding challenges, AI-powered hints, achievements, and real-time code execution into a single learning ecosystem.

---

# ✨ Features

## 🔐 Authentication & Security

* Email / Password Authentication
* Google OAuth Login
* GitHub OAuth Login
* JWT Authentication
* HttpOnly Cookie-Based Sessions
* Secure Password Hashing (bcrypt)
* Persistent Login Sessions
* Email OTP Verification for Signup
* OTP-Based Password Recovery
* Dedicated Forgot Password Flow
* Password Visibility Toggle
* Confirm Password Validation
* Frontend & Backend Input Validation
* Protected Routes with Automatic Redirects
* MongoDB TTL-Based OTP Expiration
* Single Active OTP Per Email

---

## 📚 Learning System

* Structured C++ Learning Path
* Topic-Based Learning Flow
* Stage Locking & Unlocking
* Guided Notes for Every Topic
* Progressive Difficulty System
* Beginner-Friendly C++ Starter Template
* Dynamic Course Loading

---

## 💻 Coding Environment

* Monaco Editor Integration
* Real-Time C++ Code Execution
* Custom g++ Judge Engine
* Compile Error Detection
* Runtime Error Detection
* Output Normalization
* Temporary File Cleanup
* Submission History Tracking

---

## 🤖 AI Features

* Groq-Powered AI Hint System
* Context-Aware Hint Generation
* Intelligent Guidance Before and After Code Execution

---

## 🎮 Gamification

* XP System
* Level System
* Daily Streak Tracking
* Achievement System
* Achievement Unlock Notifications
* Profile Statistics

---

## 📈 Progress Tracking

* Problem Completion Tracking
* Code Auto-Save
* Persistent Progress Storage
* Submission History
* Achievement Persistence
* Resume Learning Capability

---

## 🎨 UI/UX

* Cyberpunk-Inspired Interface
* Glassmorphism Components
* Framer Motion Animations
* Responsive Design
* Dashboard Experience
* Profile Page
* Smooth Route Transitions
* Dedicated Authentication Screens
* Consistent OTP & Password Recovery UI

---

# 🏗️ Tech Stack

## Frontend

* React
* React Router
* Tailwind CSS
* Framer Motion
* Monaco Editor
* React Markdown

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* Passport.js
* bcrypt
* Nodemailer
* Google OAuth 2.0
* GitHub OAuth

## AI

* Groq API

## Compiler

* g++

---

# 📂 Project Structure

```text
CodeHunt
├── frontend
│   ├── components
│   │   ├── AuthScreen.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Dashboard.jsx
│   │   ├── MainPanel.jsx
│   │   ├── Navbar.jsx
│   │   ├── Profile.jsx
│   │   └── Sidebar.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── backend
│   ├── models
│   │   ├── User.js
│   │   ├── Otp.js
│   │   ├── Course.js
│   │   └── Submission.js
│   │
│   ├── middleware
│   │   └── auth.js
│   │
│   ├── config
│   │   └── passport.js
│   │
│   └── server.js
│
└── README.md
```

---

# 🧠 Architecture Flow

```text
                     ┌────────────────────┐
                     │      Frontend      │
                     │       React        │
                     └─────────┬──────────┘
                               │
                               ▼
                     ┌────────────────────┐
                     │     Express API    │
                     │      Node.js       │
                     └─────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼

 ┌──────────────┐     ┌──────────────┐      ┌─────────────┐
 │ Auth Service │     │ Judge Engine │      │ AI Hint API │
 │ JWT + OAuth  │     │ g++ Compiler │      │    Groq     │
 │ OTP + Email  │     │ Code Runner  │      │             │
 └──────┬───────┘     └──────┬───────┘      └──────┬──────┘
        │                    │                     │
        └────────────────────┼─────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   MongoDB Atlas │
                    └─────────────────┘
```

---

# 🔐 Authentication Flow

```text
Register
    │
    ▼
Enter Details
    │
    ▼
Send OTP
    │
    ▼
Verify Email
    │
    ▼
Create Account
    │
    ▼
HttpOnly Cookie Session
```

```text
Login / OAuth
       │
       ▼
 Passport / JWT
       │
       ▼
 HttpOnly Cookie
       │
       ▼
 Protected Routes
       │
       ▼
 MongoDB User Data
```

```text
Forgot Password
       │
       ▼
Enter Registered Email
       │
       ▼
Send OTP
       │
       ▼
Verify OTP
       │
       ▼
Set New Password
       │
       ▼
Login
```

---

# 🎓 Learning Flow

```text
Dashboard
    │
    ▼
Topic Home
    │
 ┌──┴──┐
 ▼     ▼

Notes  Problems
          │
          ▼
     Problem List
          │
          ▼
      Problem View
          │
          ▼
       Run Code
          │
          ▼
        Submit
          │
          ▼
XP + Progress + Achievements
          │
          ▼
   Unlock Next Problem
```

---

# 🏆 Gamification Flow

```text
Accepted Solution
        │
        ▼
      Gain XP
        │
        ▼
   Update Level
        │
        ▼
   Update Streak
        │
        ▼
Check Achievements
        │
        ▼
  Save to MongoDB
```

---

# 🚀 Future Roadmap

* Multiple Programming Languages
* DSA Learning Tracks
* Contest System
* Global Leaderboards
* Peer Challenges
* Discussion Forums
* Code Review System
* Personalized Learning Paths
* Premium AI Mentor
* Mobile Application
* Backend Rate Limiting
* Branded Email Templates

---

# 👨‍💻 Author

Built by **Raghvendra Shah**

CodeHunt is designed to help beginners learn programming through a structured, gamified, and AI-assisted learning experience.

