"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ListSchema = new mongoose_1.default.Schema({
    listId: { type: String, required: true },
    listName: { type: String, required: true },
    creatorId: { type: String, required: true },
    users: { type: [String], required: true },
    items: { type: [String], required: true },
});
const ListModel = mongoose_1.default.model('lists', ListSchema);
exports.default = ListModel;
