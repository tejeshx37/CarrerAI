const bcrypt = require('bcryptjs');
const { admin, dbHelpers, COLLECTIONS } = require('../config/database');
const { User } = require('../models/User');
const { generateToken, authRateLimit } = require('../middleware/auth');

class AuthController {
  // User registration
  static async register(req, res) {
    try {
      const {
        name,
        email,
        password
      } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required'
        });
      }

      // Split name into first and last name
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Check if user already exists
      const existingUser = await dbHelpers.queryDocuments(COLLECTIONS.USERS, [
        { field: 'email', operator: '==', value: email }
      ]);

      if (existingUser.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user data with minimal required fields
      const userData = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone: '',
        dateOfBirth: new Date('2000-01-01'), // Default date
        gender: 'prefer_not_to_say',
        state: '',
        city: '',
        pincode: '',
        currentEducationLevel: '12th',
        careerInterests: [],
        preferredJobTypes: ['full_time'],
        preferredLocations: [],
        isActive: true,
        emailVerified: false,
        profileCompletionPercentage: 20 // Basic info completed
      };

      // Validate user data (without password for validation)
      const { password: userPassword, ...userDataForValidation } = userData;
      const validatedUserData = User.validate(userDataForValidation);
      const validatedData = { ...validatedUserData, password: userPassword };

      // Create user in Firestore
      const newUser = await dbHelpers.createDocument(COLLECTIONS.USERS, validatedData);

      // Calculate profile completion
      const user = new User(newUser);
      const completionPercentage = user.calculateProfileCompletion();

      // Update profile completion percentage
      await dbHelpers.updateDocument(COLLECTIONS.USERS, newUser.id, {
        profileCompletionPercentage: completionPercentage
      });

      // Generate JWT token
      const token = generateToken(newUser.id, email, 'user');

      // Remove password from response
      delete newUser.password;

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            ...newUser,
            profileCompletionPercentage: completionPercentage
          },
          token
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }
  }

  // User login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find user by email
      const users = await dbHelpers.queryDocuments(COLLECTIONS.USERS, [
        { field: 'email', operator: '==', value: email }
      ]);

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const user = users[0];

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Update last login
      await dbHelpers.updateDocument(COLLECTIONS.USERS, user.id, {
        lastLoginAt: new Date()
      });

      // Generate JWT token
      const token = generateToken(user.id, email, user.role);

      // Remove password from response
      delete user.password;

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message
      });
    }
  }

  // Firebase authentication (for existing frontend)
  static async firebaseAuth(req, res) {
    try {
      const { uid, email, displayName } = req.body;

      if (!uid || !email) {
        return res.status(400).json({
          success: false,
          message: 'Firebase UID and email are required'
        });
      }

      // Check if user exists in Firestore
      let user;
      try {
        user = await dbHelpers.getDocument(COLLECTIONS.USERS, uid);
      } catch (error) {
        // User doesn't exist, create new user
        const userData = {
          firstName: displayName?.split(' ')[0] || 'User',
          lastName: displayName?.split(' ').slice(1).join(' ') || '',
          email,
          isActive: true,
          emailVerified: true,
          role: 'user',
          profileCompletionPercentage: 20, // Basic info completed
          lastLoginAt: new Date(),
          authProvider: 'firebase'
        };

        const validatedData = User.validate(userData);
        user = await dbHelpers.createDocument(COLLECTIONS.USERS, validatedData, uid);
      }

      // Update last login
      await dbHelpers.updateDocument(COLLECTIONS.USERS, user.id, {
        lastLoginAt: new Date()
      });

      // Generate JWT token
      const token = generateToken(user.id, email, user.role);

      // Remove sensitive data
      delete user.password;

      res.json({
        success: true,
        message: 'Authentication successful',
        data: {
          user,
          token
        }
      });

    } catch (error) {
      console.error('Firebase auth error:', error);
      res.status(500).json({
        success: false,
        message: 'Authentication failed',
        error: error.message
      });
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      const user = req.user;
      
      // Remove sensitive data
      delete user.password;

      res.json({
        success: true,
        data: { user }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get profile',
        error: error.message
      });
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      // Remove fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.email;
      delete updateData.password;
      delete updateData.role;
      delete updateData.createdAt;
      delete updateData.updatedAt;

      // Validate update data
      const validatedData = User.validateUpdate(updateData);

      // Update user in Firestore
      const updatedUser = await dbHelpers.updateDocument(COLLECTIONS.USERS, userId, validatedData);

      // Calculate new profile completion percentage
      const user = new User(updatedUser);
      const completionPercentage = user.calculateProfileCompletion();

      // Update profile completion percentage
      await dbHelpers.updateDocument(COLLECTIONS.USERS, userId, {
        profileCompletionPercentage: completionPercentage
      });

      // Remove password from response
      delete updatedUser.password;

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            ...updatedUser,
            profileCompletionPercentage: completionPercentage
          }
        }
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: error.message
      });
    }
  }

  // Change password
  static async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
      }

      // Get current user
      const user = await dbHelpers.getDocument(COLLECTIONS.USERS, userId);

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await dbHelpers.updateDocument(COLLECTIONS.USERS, userId, {
        password: hashedNewPassword
      });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password',
        error: error.message
      });
    }
  }

  // Logout (client-side token invalidation)
  static async logout(req, res) {
    try {
      // In a stateless JWT system, logout is handled client-side
      // by removing the token from storage
      res.json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        error: error.message
      });
    }
  }

  // Verify email (placeholder for future implementation)
  static async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      // TODO: Implement email verification logic
      // This would typically involve:
      // 1. Verifying the token
      // 2. Updating user's emailVerified status
      // 3. Sending confirmation email

      res.json({
        success: true,
        message: 'Email verification endpoint - to be implemented'
      });

    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Email verification failed',
        error: error.message
      });
    }
  }

  // Forgot password (placeholder for future implementation)
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      // TODO: Implement forgot password logic
      // This would typically involve:
      // 1. Checking if user exists
      // 2. Generating reset token
      // 3. Sending reset email

      res.json({
        success: true,
        message: 'Password reset email sent (placeholder)'
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process forgot password request',
        error: error.message
      });
    }
  }
}

module.exports = AuthController;
