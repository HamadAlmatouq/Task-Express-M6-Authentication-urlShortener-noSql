const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// require("dotenv").config();
const { JWT_TOKEN_EXP, JWT_SECRET } = process.env;

exports.signup = async (req, res, next) => {
  const { password } = req.body;
  const saltRounds = 10;
  // const token = jwt.sign(JSON.stringify(payload), "asupersecretkey");
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;

    const newUser = await User.create(req.body);

    const token = generateToken(newUser);

    console.log("exports.signup -> hashedPassword", hashedPassword);

    res.status(201).json({ message: "User has been created" });
  } catch (err) {
    next(err);
  }
};

exports.generateToken = async (req, res) => {
  const { user } = req;
  const payload = {
    username: user.username,
    _id: user._id,
    // exp: Date.now() + JWT_TOKEN_EXP,
  };
  const token = jwt.sign(JSON.stringify(payload), JWT_SECRET, {
    expiresIn: JWT_TOKEN_EXP,
  });
  res.json({ token });
};

exports.signin = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    next(err);
  }
};
