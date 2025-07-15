"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (err, req, res, next) => {
    res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: (err === null || err === void 0 ? void 0 : err.message) || "Unknown error",
    });
};
exports.globalErrorHandler = globalErrorHandler;
