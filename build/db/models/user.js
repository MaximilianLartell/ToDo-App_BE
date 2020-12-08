"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    createdLists: { type: [String], required: true },
    subscribedLists: { type: [String], required: true },
    online: { type: Boolean, required: true },
});
const UserModel = mongoose_1.default.model('users', UserSchema);
exports.default = UserModel;
