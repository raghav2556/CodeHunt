# 🚀 CodeHunt

> Hunt. Level Up. Master C++.

CodeHunt is a full-stack coding academy platform built to provide a structured learning path for beginners learning C++. Unlike traditional coding platforms that focus only on problem solving, CodeHunt combines guided notes, staged progression, coding challenges, AI-powered hints, achievements, and gamification into a single learning experience.

---

# ✨ Features

## Authentication & Security

* Email / Password Authentication
* Google OAuth Login
* GitHub OAuth Login
* JWT Authentication
* HttpOnly Cookie-Based Sessions
* Secure Password Hashing (bcrypt)
* Persistent Login Sessions

---

## Learning System

* Structured C++ Course
* Topic-Based Learning Flow
* Stage Locking & Unlocking
* Guided Notes for Every Topic
* Progressive Difficulty System
* Beginner-Friendly C++ Starter Template

---

## Coding Environment

* Monaco Editor Integration
* Real C++ Code Execution
* g++ Judge Engine
* Compile Error Handling
* Runtime Error Handling
* Output Normalization
* Temporary File Cleanup

---

## AI Features

* Groq-Powered AI Hint System
* Context-Aware Hint Generation
* Intelligent Guidance Before/After Code Execution

---

## Gamification

* XP System
* Level System
* Daily Streaks
* Achievement System
* Achievement Popups
* Profile Statistics

---

## Progress Tracking

* Problem Completion Tracking
* Submission History
* Code Auto-Save
* Persistent Progress Storage
* Achievement Persistence
* Resume Learning Capability

---

## UI/UX

* Modern Cyberpunk Theme
* Framer Motion Animations
* Responsive Layout
* Topic Home Screen
* Dashboard Analytics
* Profile Page
* Smooth Route Transitions

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
* Google OAuth 2.0
* GitHub OAuth

## AI

* Groq API

## Compiler

* g++

---

# 📂 Project Structure

CodeHunt

├── frontend

│ ├── components

│ │ ├── AuthScreen.jsx

│ │ ├── Dashboard.jsx

│ │ ├── MainPanel.jsx

│ │ ├── Navbar.jsx

│ │ ├── Profile.jsx

│ │ └── Sidebar.jsx

│ ├── App.jsx

│ └── index.css

│

├── backend

│ ├── models

│ │ ├── User.js

│ │ ├── Course.js

│ │ └── Submission.js

│ │

│ ├── middleware

│ │ └── auth.js

│ │

│ ├── config

│ │ └── passport.js

│ │

│ └── server.js

│

└── README.md

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
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼

 ┌────────────┐   ┌──────────────┐   ┌─────────────┐
 │ Auth Layer │   │ Judge Engine │   │ AI Hint API │
 │ JWT/OAuth  │   │ g++ Compile  │   │    Groq     │
 └─────┬──────┘   └──────┬───────┘   └──────┬──────┘
       │                 │                  │
       └─────────────────┼──────────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │   MongoDB Atlas │
                └─────────────────┘
```

---

# 🎮 Learning Flow

```text
Dashboard
    │
    ▼
Topic Home
    │
 ┌──┴──┐
 ▼     ▼

Notes Problems

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

# 🔐 Authentication Flow

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

---

# 🚀 Future Roadmap

* Multiple Programming Languages
* DSA Learning Tracks
* Contest System
* Leaderboards
* Peer Challenges
* Code Review System
* Discussion Forums
* Personalized Learning Paths
* Premium AI Mentor
* Mobile Application

---

# 👨‍💻 Author

Built by Raghvendra Shah

CodeHunt is designed to help beginners learn programming through a structured, gamified, and AI-assisted learning experience.
"""

