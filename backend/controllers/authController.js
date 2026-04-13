const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
  
  const refreshToken = jwt.sign(
    { userId, tokenId: uuidv4() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
  
  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role = 'buyer' } = req.body;
    
    // Check if user exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Insert user
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, first_name, last_name, role`,
      [email, passwordHash, firstName, lastName, phone, role, false]
    );
    
    const user = result.rows[0];
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    
    // Store refresh token
    await query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Get user
    const result = await query(
      'SELECT id, email, password_hash, first_name, last_name, role, is_active, is_verified FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    if (!user.is_active) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last login
    await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    
    // Store refresh token
    await query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    );
    
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isVerified: user.is_verified
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }
    
    // Verify token exists and is not revoked
    const tokenResult = await query(
      'SELECT user_id, revoked_at FROM refresh_tokens WHERE token = $1',
      [refreshToken]
    );
    
    if (tokenResult.rows.length === 0 || tokenResult.rows[0].revoked_at) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    
    // Verify JWT
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Generate new tokens
    const tokens = generateTokens(decoded.userId);
    
    // Revoke old token and store new one
    await query('UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE token = $1', [refreshToken]);
    await query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [decoded.userId, tokens.refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    );
    
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      await query('UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE token = $1', [refreshToken]);
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const result = await query(
      `SELECT id, email, first_name, last_name, phone, role, avatar_url, bio, 
              company_name, license_number, address, city, province, region, 
              is_verified, is_active, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = result.rows[0];
    
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      fullName: `${user.first_name} ${user.last_name}`,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      companyName: user.company_name,
      licenseNumber: user.license_number,
      address: user.address,
      city: user.city,
      province: user.province,
      region: user.region,
      isVerified: user.is_verified,
      isActive: user.is_active,
      createdAt: user.created_at
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user info', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, bio, companyName, address, city, province } = req.body;
    
    const result = await query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, phone = $3, bio = $4, 
           company_name = $5, address = $6, city = $7, province = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING id, email, first_name, last_name, phone, role, avatar_url`,
      [firstName, lastName, phone, bio, companyName, address, city, province, req.user.id]
    );
    
    const user = result.rows[0];
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatar_url
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get current password hash
    const userResult = await query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [newPasswordHash, req.user.id]);
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change password', error: error.message });
  }
};
