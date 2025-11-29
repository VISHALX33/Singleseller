/**
 * User Model - Represents users (customers and admins)
 * Includes authentication methods and address management
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },

    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
    },

    // Role and Status
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },

    // Avatar
    avatar: {
      type: String,
      default: null,
    },

    // Addresses
    addresses: [
      {
        _id: false,
        street: {
          type: String,
          required: true,
          trim: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
        state: {
          type: String,
          required: true,
          trim: true,
        },
        pincode: {
          type: String,
          required: true,
          match: [/^[0-9]{6}$/, 'Pincode must be 6 digits'],
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Email Verification
    emailVerified: {
      type: Boolean,
      default: false,
    },

    // Last Login
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for frequently queried fields
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
  const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_key_change_in_production';
  const jwtExpire = process.env.JWT_EXPIRE || '7d';
  
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  const token = jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    jwtSecret,
    {
      expiresIn: jwtExpire,
    }
  );

  return token;
};

// Method to get public profile (without password)
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Virtual for formatted phone
userSchema.virtual('formattedPhone').get(function () {
  return this.phone
    ? `+91 ${this.phone.slice(0, 5)} ${this.phone.slice(5)}`
    : null;
});

// Virtual for default address
userSchema.virtual('defaultAddress').get(function () {
  return this.addresses.find((addr) => addr.isDefault) || this.addresses[0] || null;
});

// Create and export User model
const User = mongoose.model('User', userSchema);
export default User;
