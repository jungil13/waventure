const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const register = async (req, res) => {
  try {
    const { fullName, email, password, userType } = req.body;

    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Save user
    const userId = await User.create(fullName, email, passwordHash, userType);

    res.status(201).json({
      message: "User registered successfully",
      userId,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const secret = process.env.JWT_SECRET || "your_super_secret_key";
    const token = jwt.sign(
      {
        user_id: user.user_id, 
        email: user.email,
        user_type: user.user_type,
      },
      secret,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        fullName: user.full_name,
        user_type: user.user_type,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email, captchaAnswer, captchaQuestion } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!captchaAnswer) {
      return res.status(400).json({ message: "Please complete the verification" });
    }

    // Check if email exists in database
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Email not found in our database" });
    }

    // Verify captcha answer
    if (captchaQuestion && captchaAnswer) {
      // Extract numbers from question like "5 + 3 = ?"
      const match = captchaQuestion.match(/(\d+)\s*\+\s*(\d+)/);
      if (match) {
        const num1 = parseInt(match[1]);
        const num2 = parseInt(match[2]);
        const correctAnswer = num1 + num2;
        
        if (parseInt(captchaAnswer) !== correctAnswer) {
          return res.status(400).json({ 
            message: "Incorrect verification answer. Please try again."
          });
        }
      }
    }

    // If email exists and captcha is correct, generate reset token
    const { resetToken } = await User.createPasswordResetToken(email);

    res.json({
      message: "Email verified successfully. Redirecting to password reset...",
      resetToken,
      resetUrl: `http://localhost:5173/reset-password?token=${resetToken}`,
      user: {
        email: user.email,
        fullName: user.full_name
      },
      redirect: true // Flag to indicate frontend should redirect
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const success = await User.resetPasswordWithToken(token, newPassword);

    if (success) {
      res.json({
        message: "Password reset successfully"
      });
    } else {
      res.status(400).json({ message: "Failed to reset password" });
    }
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const tokenData = await User.verifyPasswordResetToken(token);

    res.json({
      message: "Token is valid",
      user: {
        email: tokenData.email,
        fullName: tokenData.full_name
      }
    });
  } catch (error) {
    console.error("Verify token error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

module.exports = { register, login, forgotPassword, resetPassword, verifyResetToken };
