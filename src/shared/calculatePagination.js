"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePagination = void 0;
// shared/calculatePagination.ts
const calculatePagination = (options) => {
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 10);
    const skip = (page - 1) * limit;
    return {
        page,
        limit,
        skip,
    };
};
exports.calculatePagination = calculatePagination;
