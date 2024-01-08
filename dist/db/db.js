"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const URI = 'mongodb://localhost:27017/you_app';
function connectMongo() {
    mongoose_1.default
        .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
        console.log('Connected To mongo');
    })
        .catch((error) => {
        console.log(error);
    });
}
exports.connectMongo = connectMongo;
