"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isError = exports.isPassword = exports.isList = exports.isItem = exports.isUser = void 0;
exports.isUser = (input) => {
    return input.userId !== undefined;
};
exports.isItem = (input) => {
    return input.itemId !== undefined;
};
exports.isList = (input) => {
    return input.listId !== undefined;
};
exports.isPassword = (input) => {
    return input.password !== undefined;
};
exports.isError = (input) => {
    return input.type === 'Error';
};
