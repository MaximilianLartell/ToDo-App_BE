"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = exports.Message = void 0;
var Message;
(function (Message) {
    Message["NAME_TAKEN"] = "Username taken";
    Message["NOT_FOUND"] = "Not found";
    Message["LIST_NOT_FOUND"] = "List not found";
    Message["ITEM_NOT_FOUND"] = "List not found";
    Message["USER_NOT_FOUND"] = "User not found";
    Message["WRONG_PASSWORD"] = "Wrong password";
})(Message = exports.Message || (exports.Message = {}));
var Events;
(function (Events) {
    Events["CONNECT"] = "connect";
    Events["DISCONNECT"] = "disconnect";
    Events["SIGN_IN"] = "sign_in";
    Events["SIGN_OUT"] = "sign_out";
    Events["CREATE_LIST"] = "create_list";
    Events["JOIN_LIST"] = "join_list";
    Events["REMOVE_LIST"] = "remove_list";
    Events["NEW_ITEM"] = "new_item";
    Events["REMOVE_ITEM"] = "remove_item";
    Events["TOGGLE_DONE"] = "toggle_done";
    // CREATE_USER = 'create_user',
})(Events = exports.Events || (exports.Events = {}));
