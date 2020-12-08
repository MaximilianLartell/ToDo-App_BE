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
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@reminderapp.czpki.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const server = new mongodb_memory_server_1.MongoMemoryServer();
let database;
const connect = () => {
    if (database) {
        console.log('db already connected');
        return;
    }
    mongoose_1.default.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
    database = mongoose_1.default.connection;
    database.once('open', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Connected to database');
    }));
    database.on('error', () => {
        console.log('Error connecting to database');
    });
};
const disconnect = () => {
    if (!database) {
        console.log('db already disconnected');
        return;
    }
    mongoose_1.default.disconnect();
};
const devConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uri = yield server.getUri();
        mongoose_1.default
            .connect(uri, {
            useNewUrlParser: true,
            useCreateIndex: false,
            useUnifiedTopology: true,
        })
            .then(() => console.log('dev db setup complete'));
    }
    catch (err) {
        console.log(err);
    }
});
const devDisconnect = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect().then(() => console.log('dev db stopped'));
    yield server.stop();
});
let dbSetup = process.env.NODE_ENV === 'production'
    ? { connect, disconnect }
    : { connect: devConnect, disconnect: devDisconnect };
exports.default = dbSetup;
