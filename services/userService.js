const { userModel } = require('../models');
const bcrypt = require('bcrypt');

const userService = {
    createUser: async (userData) => {
        try {
            const newUser = new userModel(userData);
            return await newUser.save();
        } catch (error) {
            throw error;
        }
    },

    getUserById: async (userId) => {
        try {
            return await userModel.findById(userId).select('-password');
        } catch (error) {
            throw error;
        }
    },

    getUserByEmail: async (email) => {
        try {
            return await userModel.findOne({ email }).select('-password');
        } catch (error) {
            throw error;
        }
    },

    updateUser: async (userId, updateData) => {
        try {
            return await userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
        } catch (error) {
            throw error;
        }
    },

    deleteUser: async (userId) => {
        try {
            return await userModel.findByIdAndUpdate(userId, { isDeleted: true }, { new: true });
        } catch (error) {
            throw error;
        }
    },

    authenticateUser: async (email, password) => {
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }
            return user;
        } catch (error) {
            throw error;
        }
    },

    changePassword: async (userId, oldPassword, newPassword) => {
        try {
            const user = await userModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            const isMatch = await user.comparePassword(oldPassword);
            if (!isMatch) {
                throw new Error('Invalid old password');
            }
            user.password = newPassword;
            return await user.save();
        } catch (error) {
            throw error;
        }
    }
};

module.exports = userService;
