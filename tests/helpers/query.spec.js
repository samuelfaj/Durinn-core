"use strict";
/**
 * Database and query builder tests
 */
var __importDefault =
	(this && this.__importDefault) ||
	function(mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
const durinn_1 = __importDefault(require("../../durinn"));
if (
	durinn_1.default.config.database.host &&
	durinn_1.default.config.database.user &&
	durinn_1.default.config.database.database
) {
	durinn_1.default.tests.mocha.describe("Query Builder exec method", () => {
		it("Result shoud be an object", done => {
			new durinn_1.default.query().exec("SHOW variables", function(
				result,
				response,
				error
			) {
				durinn_1.default.tests.expect(response).to.be.an("object");
				done();
			});
		});
		it("Result.result shoud be true", done => {
			new durinn_1.default.query().exec("SHOW variables", function(
				result,
				response,
				error
			) {
				durinn_1.default.tests.expect(result).to.be.true;
				done();
			});
		});
		it("Result.rows shoud be an array", done => {
			new durinn_1.default.query().exec("SHOW variables", function(
				result,
				response,
				error
			) {
				durinn_1.default.tests.expect(response.rows).to.be.an("array");
				done();
			});
		});
		it("Result.fields shoud be an array", done => {
			new durinn_1.default.query().exec("SHOW variables", function(
				result,
				response,
				error
			) {
				durinn_1.default.tests
					.expect(response.fields)
					.to.be.an("array");
				done();
			});
		});
		it("In SHOW or Select queries, result.insertId should be 0", done => {
			new durinn_1.default.query().exec("SHOW variables", function(
				result,
				response,
				error
			) {
				durinn_1.default.tests
					.expect(response.insertId)
					.to.be.an("null");
				done();
			});
		});
		it("In SHOW or Select queries, result.changedRows should be 0", done => {
			new durinn_1.default.query().exec("SHOW variables", function(
				result,
				response,
				error
			) {
				durinn_1.default.tests
					.expect(response.changedRows)
					.to.equals(0);
				done();
			});
		});
		it("In SHOW or Select queries, result.affectedRows should be 0", done => {
			new durinn_1.default.query().exec("SHOW variables", function(
				result,
				response,
				error
			) {
				durinn_1.default.tests
					.expect(response.affectedRows)
					.to.equals(0);
				done();
			});
		});
	});
}
