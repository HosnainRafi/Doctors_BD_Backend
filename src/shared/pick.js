"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = void 0;
const pick = (obj, keys) => {
    const entries = Object.entries(obj);
    return entries
        .filter(([key]) => keys.includes(key))
        .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});
};
exports.pick = pick;
