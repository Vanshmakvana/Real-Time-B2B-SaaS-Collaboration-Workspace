"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseFormatter = void 0;
const responseFormatter = (req, res, next) => {
    const customRes = res;
    customRes.success = (data, message = 'Success', statusCode = 200) => {
        res.status(statusCode).json({
            success: true,
            message,
            data
        });
    };
    customRes.error = (message, statusCode = 500, errors = null) => {
        res.status(statusCode).json({
            success: false,
            message,
            errors
        });
    };
    next();
};
exports.responseFormatter = responseFormatter;
