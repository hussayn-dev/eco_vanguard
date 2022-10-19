const GoogleStrategy = require("passport-google-oidc");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");

const googleStrategy = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: "process.env['GOOGLE_CLIENT_ID']",
        clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
        callbackURL: "https://www.example.com/oauth/google/redirect",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await User.findOne({ googleId: profile.id });
          if (user) {
            done(null, user);
          } else {
            const user = new User({});
            const profile = new Profile({});
            user.profile = profile._id;
            profile.owner = user._id;
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) =>
    done(null, await User.findById(id))
  );
};

module.exports = googleStrategy;
