const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../api/config/keys");
const User = require("../models/User");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;

exports.localStrategy = new LocalStrategy(
  { usernameField: "username" },
  async (username, password, done) => {
    try {
      const user = await User.findOne({
        username, // equivalent to { name : name }
      });

      const passwordsMatch = user
        ? await bcrypt.compare(password, user.password)
        : false;

      if (passwordsMatch) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      done(error);
    }
  }
);

exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },

  async (jwtPayload, done) => {
    if (Date.now() > jwtPayload.exp) {
      return done(null, false); // this will throw a 401
    }
    try {
      const user = await User.findById(jwtPayload.id);
      done(null, user); // if there is no user, this will throw a 401
    } catch (error) {
      done(error);
    }
  }
);
