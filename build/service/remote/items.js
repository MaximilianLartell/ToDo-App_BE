"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeManyItems = exports.removeItem = exports.updateItem = exports.addItem = exports.findItemsByListId = exports.findItemById = exports.findManyItems = void 0;
const types_1 = require("../../types");
const item_1 = __importDefault(require("../../db/models/item"));
const helpers_1 = require("../../utils/helpers");
const parseResponse = (document) => ({
    itemId: document.itemId,
    creatorId: document.creatorId,
    description: document.description,
    listId: document.listId,
    done: document.done,
});
exports.findManyItems = (arr) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield item_1.default.find({ itemId: { $in: arr } }).exec();
    const parsedItems = items.map((el) => parseResponse(el));
    return parsedItems;
});
exports.findItemById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield item_1.default.findOne({ itemId: id }).exec();
    if (!document)
        return helpers_1.errorMessage(types_1.Message.ITEM_NOT_FOUND);
    return parseResponse(document);
});
exports.findItemsByListId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield item_1.default.find({ listId: id }).exec();
    const parsedItems = items.map((el) => parseResponse(el));
    return parsedItems;
});
exports.addItem = (item) => __awaiter(void 0, void 0, void 0, function* () {
    const newItem = new item_1.default(item);
    const document = yield newItem.save();
    return parseResponse(document);
});
exports.updateItem = (item) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield item_1.default.findOneAndUpdate({ itemId: item.itemId }, {
        done: !item.done,
    }, { new: true, useFindAndModify: false }).exec();
    if (!document)
        return helpers_1.errorMessage(types_1.Message.ITEM_NOT_FOUND);
    return parseResponse(document);
});
exports.removeItem = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield item_1.default.findOne({ itemId: id }).exec();
    const status = yield item_1.default.deleteOne({ itemId: id }).exec();
    if (!document || status.ok !== 1)
        return helpers_1.errorMessage(types_1.Message.ITEM_NOT_FOUND);
    return parseResponse(document);
});
exports.removeManyItems = (arr) => __awaiter(void 0, void 0, void 0, function* () {
    yield item_1.default.deleteMany({ itemId: { $in: arr } }).exec();
});
