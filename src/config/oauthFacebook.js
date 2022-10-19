const FacebookStrategy = require("passport-facebook");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");

const facebookStrategy = (passport) => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env["FACEBOOK_APP_ID"],
        clientSecret: process.env["FACEBOOK_APP_SECRET"],
        callbackURL: "https://www.example.com/oauth/facebook/redirect",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await User.findOne({ facebookId: profile.id });
          if (user) {
            done(null, user);
          } else {
            const user = new User({});
            const profile = new Profile({});
            profile.owner = user._id;
            user.profile = profile._id;
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
