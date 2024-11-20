const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_EXPIRATION_MS, JWT_SECRET } = require("../config/keys");

const generateToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION_MS });
};

exports.signup = async (req, res, next) => {
  try {
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = await User.create({
      username: req.body.username,
      password: hashPassword,
    });

    const token = generateToken(newUser);

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

//Sign in
exports.signin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ meesage: "Invaild credetials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ meesage: "Invaild credetials" });
    }
    const token = generateToken(user);
    res.status(200).json({ token, message: "Signed in succesfully" });
  } catch (err) {
    next(err);
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
