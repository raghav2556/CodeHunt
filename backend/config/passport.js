const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

// GOOGLE
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async (_, __, profile, done) => {
      try {
        let user = await User.findOne({
          googleId: profile.id
        });

        if (!user) {
          user = await User.findOne({
            email: profile.emails[0].value
          });

          if (user) {
            user.googleId = profile.id;

            if (!user.provider?.includes("google")) {
              user.provider =
                user.provider === "github"
                  ? "github,google"
                  : "google";
            }

            await user.save();
          } else {
            user = await User.create({
              username: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              provider: "google"
            });
          }
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// GITHUB
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback"
    },
    async (_, __, profile, done) => {
      try {
        let user = await User.findOne({
          githubId: profile.id
        });

        if (!user) {
          const email =
            profile.emails?.[0]?.value ||
            `${profile.username}@github.local`;

          user = await User.findOne({ email });

          if (user) {
            user.githubId = profile.id;

            if (!user.provider?.includes("github")) {
              user.provider =
                user.provider === "google"
                  ? "google,github"
                  : "github";
            }

            await user.save();
          } else {
            user = await User.create({
              username: profile.username,
              email,
              githubId: profile.id,
              provider: "github"
            });
          }
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;