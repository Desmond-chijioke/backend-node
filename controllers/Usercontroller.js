const User = require("../models/User");

// @desc    Get all users
// @route   GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new user
// @route   POST /api/users
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    // Handle duplicate email
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a user (including optional profile picture)
// @route   PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };

    // If a file was uploaded, attach the Cloudinary URL
    if (req.file) {
      updates.profilePicture = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };