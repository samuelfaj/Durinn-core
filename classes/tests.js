"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Mocha = __importStar(require("mocha"));
class default_1 {
    static get mocha() {
        return Mocha;
    }
    static get expect() {
        return chai_1.expect;
    }
    static get should() {
        return chai_1.should;
    }
    static get assert() {
        return chai_1.assert;
    }
}
exports.default = default_1;
