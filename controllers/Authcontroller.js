const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE });

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const user = await User.create({ name, email, password, age });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Explicitly select password since it's excluded by default
    const user = await User.findOne({ email }).select("+password +refreshToken");
    if (!user || !user.password || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save new refresh token to DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "Refresh token is required" });
    }

    // Verify the token signature
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check it matches what we stored in DB
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = async (req, res) => {
  try {
    // Clear refresh token from DB
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, refresh, logout };
