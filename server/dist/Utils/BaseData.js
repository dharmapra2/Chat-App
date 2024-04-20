"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalData = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class BaseData {
    saltRounds;
    constructor() {
        this.saltRounds = 10;
    }
    genrateHashPass = async (password) => {
        try {
            const result = await bcrypt_1.default.hash(password, this.saltRounds);
            return result;
        }
        catch (error) {
            throw error;
        }
    };
    comparePass = async (password, comparePassword) => {
        try {
            return await bcrypt_1.default.compare(password, comparePassword);
        }
        catch (error) {
            throw error;
        }
    };
}
exports.GlobalData = new BaseData();
