const utils = {
    successResponse: (res, data, message = 'Operation successful', statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    },

    errorResponse: (res, message = 'An error occurred', statusCode = 500, error = null) => {
        const response = {
            success: false,
            message
        };

        if (error) {
            response.error = error;
        }

        return res.status(statusCode).json(response);
    },

    notFoundResponse: (res, message = 'Resource not found') => {
        return res.status(404).json({
            success: false,
            message
        });
    },

    validationErrorResponse: (res, errors) => {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors
        });
    }
    ,

    isValidPhoneNumber: (phone) => {
        // This regex pattern matches a variety of phone number formats
        // It allows for optional country codes, spaces, dashes, and parentheses
        const phoneRegex = /^(\+\d{1,3}[-\s]?)?\(?[0-9]{3}\)?[-\s]?[0-9]{3}[-\s]?[0-9]{4}$/;
        return phoneRegex.test(phone);
    },

    isValidEmail: (email) => {
        // This regex pattern follows the RFC 5322 standard for email validation
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return emailRegex.test(email);
    },

    isValidPassword: (password) => {
        // Password must be at least 8 characters long and contain at least one uppercase letter,
        // one lowercase letter, one number, and one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }


}

module.exports = utils