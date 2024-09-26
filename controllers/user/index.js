const { userService } = require('../../services');
const utils = require('../../utils');

const userController = {
    signup:async(req, res)=>{
        try {
            const { username, password, phone, email } = req.body;

            // Field validation
            if (!username || !password || !phone) {
                return utils.errorResponse(res,'Username, password, and phone are required', 400);
            }
            if (!utils.isValidPassword(password)) {
                return utils.errorResponse(res, 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character', 400);
            }

            if (!utils.isValidPhoneNumber(phone)) {
                return utils.errorResponse(res, 'Invalid phone number format', 400);
            }

            if (email && !utils.isValidEmail(email)) {
                return utils.errorResponse(res, 'Invalid email format', 400);
            }

            // Check if user already exists with the given phone number
            const existingUserByPhone = await userService.getUserByPhone(phone);
            if (existingUserByPhone) {
                return utils.errorResponse(res, 'A user with this phone number already exists', 400);
            }

            // Check if user already exists with the given email (if provided)
            if (email) {
                const existingUserByEmail = await userService.getUserByEmail(email);
                if (existingUserByEmail) {
                    return utils.errorResponse(res, 'A user with this email already exists', 400);
                }
            }
            // Create user using userService
            const newUser = await userService.createUser({ username, password, phone, email });

            return utils.successResponse(res, {
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    phone: newUser.phone,
                    email: newUser.email
                }
            },'User created successfully', 201);
        } catch (error) {
            console.error('Error in user signup:', error);
            return utils.errorResponse(res, 500, 'Internal server error');
        }
    },

    login: async (req, res) => {
        try {
            const { phone, password } = req.body;

            // Field validation
            if (!phone || !password) {
                return utils.errorResponse(res, 'Phone and password are required', 400);
            }

            if (!utils.isValidPhoneNumber(phone)) {
                return utils.errorResponse(res, 'Invalid phone number format', 400);
            }

            // Authenticate user
            const user = await userService.authenticateUser(phone, password);
            if (!user) {
                return utils.errorResponse(res, 'User not found', 404);
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return utils.errorResponse(res, 'Invalid credentials', 401);
            }

            // Generate JWT token (assuming you have a function for this)
            // const token = generateToken(user);

            // Generate JWT token
            const token = utils.generateToken({
                id: user._id,
                username: user.username,
                phone: user.phone,
                email: user.email
            });
            return utils.successResponse(res, {
                user: {
                    id: user._id,
                    username: user.username,
                    phone: user.phone,
                    email: user.email
                },
                token: token
            }, 'User signed in successfully');
        } catch (error) {
            console.error('Error in user login:', error);
            return utils.errorResponse(res, 'Internal server error', 500);
        }
    },
}

module.exports = userController