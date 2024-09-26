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
    }
}

module.exports = userController