"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function(mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
const durinn_1 = __importDefault(require("../durinn"));
durinn_1.default.tests.mocha.describe("An example of Unit Test", () => {
	it("Should be less than 100", () => {
		const result = Math.random();
		durinn_1.default.tests.expect(result).to.lessThan(100);
	});
});
