"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                error: result.error.format(),
            });
            return; // prevent further execution
        }
        // Optional: replace req.body with parsed data for safety
        req.body = result.data;
        next();
    };
};
exports.validateRequest = validateRequest;
