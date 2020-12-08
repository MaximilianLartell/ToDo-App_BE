"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PasswordSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    password: { type: String, required: true },
});
const PasswordModel = mongoose_1.default.model('passwords', PasswordSchema);
exports.default = PasswordModel;
