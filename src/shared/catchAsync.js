"use strict";
// src/shared/catchAsync.ts
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync = (fn) => {
    return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
};
exports.default = catchAsync;
