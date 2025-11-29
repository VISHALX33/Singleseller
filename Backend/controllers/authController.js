// Authentication controller: handles user registration, login, profile management, and password changes.
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

// Helper to sanitize user output
function sanitize(user) {
  if (!user) return null;
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    addresses: user.addresses,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return next(new ApiError('Email already registered', 400));

    const user = await User.create({ name, email, password, phone });
    const token = user.generateAuthToken();
    res.status(201).json({ success: true, token, user: sanitize(user) });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new ApiError('Invalid credentials', 401));
    const match = await user.comparePassword(password);
    if (!match) return next(new ApiError('Invalid credentials', 401));
    const token = user.generateAuthToken();
    res.json({ success: true, token, user: sanitize(user) });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

// Logout is client-side token discard; respond success.
exports.logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out. Discard token client-side.' });
};

exports.getProfile = async (req, res) => {
  res.json({ success: true, user: sanitize(req.user) });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const fields = ['name', 'phone', 'avatar'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) {
        req.user[f] = req.body[f];
      }
    });
    await req.user.save();
    res.json({ success: true, user: sanitize(req.user) });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return next(new ApiError('Old and new password are required', 400));
    }
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return next(new ApiError('User not found', 404));
    const match = await user.comparePassword(oldPassword);
    if (!match) return next(new ApiError('Old password incorrect', 401));
    user.password = newPassword; // will be hashed by pre-save hook
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};
