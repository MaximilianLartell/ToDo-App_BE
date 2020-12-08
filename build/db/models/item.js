"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ItemSchema = new mongoose_1.default.Schema({
    itemId: { type: String, required: true },
    creatorId: { type: String, required: true },
    description: { type: String, required: true },
    listId: { type: String, required: true },
    done: { type: Boolean, required: true },
});
const ItemModel = mongoose_1.default.model('items', ItemSchema);
exports.default = ItemModel;
