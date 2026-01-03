import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || "7d",
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id, user.role);

    console.log(`User registered: ${email}`);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(`Registration error: ${error.message}`);
    res.status(500).json({
      message: error.message || "Registration failed",
    });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    console.log(`User logged in: ${email}`);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact: user.contact,
      },
    });
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    res.status(500).json({
      message: error.message || "Login failed",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(`Get profile error: ${error.message}`);
    res.status(500).json({
      message: error.message || "Failed to fetch profile",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, contact, addresses } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(name && { name }),
        ...(contact && { contact }),
        ...(addresses && { addresses }),
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.log(`User profile updated: ${user.email}`);

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(`Update profile error: ${error.message}`);
    res.status(500).json({
      message: error.message || "Failed to update profile",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(`Get all users error: ${error.message}`);
    res.status(500).json({
      message: error.message || "Failed to fetch users",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.log(`User deleted: ${user.email}`);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(`Delete user error: ${error.message}`);
    res.status(500).json({
      message: error.message || "Failed to delete user",
    });
  }
};

export const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { isActive: false },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.log(`User account deactivated: ${user.email}`);

    res.status(200).json({
      message: "Account deactivated successfully",
    });
  } catch (error) {
    console.error(`Deactivate account error: ${error.message}`);
    res.status(500).json({
      message: error.message || "Failed to deactivate account",
    });
  }
};

export const activateAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { isActive: true },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.log(`User account activated: ${user.email}`);

    res.status(200).json({
      message: "Account activated successfully",
      user,
    });
  } catch (error) {
    console.error(`Activate account error: ${error.message}`);
    res.status(500).json({
      message: error.message || "Failed to activate account",
    });
  }
};
