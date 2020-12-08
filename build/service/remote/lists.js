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
exports.removeList = exports.updateList = exports.addList = exports.findListById = exports.findManyLists = void 0;
const types_1 = require("../../types");
const helpers_1 = require("../../utils/helpers");
const list_1 = __importDefault(require("../../db/models/list"));
const parseResponse = (document) => ({
    listId: document.listId,
    listName: document.listName,
    creatorId: document.creatorId,
    users: [...document.users],
    items: [...document.items],
});
exports.findManyLists = (arr) => __awaiter(void 0, void 0, void 0, function* () {
    const lists = yield list_1.default.find({ listId: { $in: arr } }).exec();
    return lists.map((el) => parseResponse(el));
});
exports.findListById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield list_1.default.findOne({ listId: id }).exec();
    if (!document)
        return helpers_1.errorMessage(types_1.Message.LIST_NOT_FOUND);
    return parseResponse(document);
});
exports.addList = (list) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield new list_1.default(list).save();
    return parseResponse(document);
});
exports.updateList = (list) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield list_1.default.findOneAndUpdate({ listId: list.listId }, {
        users: list.users,
        items: list.items,
    }, { new: true, useFindAndModify: false }).exec();
    if (!document)
        return helpers_1.errorMessage(types_1.Message.LIST_NOT_FOUND);
    return parseResponse(document);
});
exports.removeList = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield list_1.default.findOne({ listId: id }).exec();
    const status = yield list_1.default.deleteOne({ listId: id }).exec();
    if (!document || status.ok !== 1)
        return helpers_1.errorMessage(types_1.Message.LIST_NOT_FOUND);
    return parseResponse(document);
});
