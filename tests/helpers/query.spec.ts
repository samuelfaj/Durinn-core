/**
 * Database and query builder tests
 */

import Durinn from "../../durinn";

if (
	Durinn.config.database.host &&
	Durinn.config.database.user &&
	Durinn.config.database.database
) {
	Durinn.tests.mocha.describe("Query Builder exec method", () => {
		it("Result shoud be an object", done => {
			new Durinn.query().exec("SHOW variables", function(
				result,
				response,
				error
			) {
				Durinn.tests.expect(response).to.be.an("object");
				done();
			});
		});

		it("Result.result shoud be true", done => {
			new Durinn.query().exec("SHOW variables", function(
				result,
				response,
				error
			) {
				Durinn.tests.expect(result).to.be.true;
				done();
			});
		});

		it("Result.rows shoud be an array", done => {
			new Durinn.query().exec("SHOW variables", function(
				result,
				response,
				error
			) {
				Durinn.tests.expect(response.rows).to.be.an("array");
				done();
			});
		});

		it("Result.fields shoud be an array", done => {
			new Durinn.query().exec("SHOW variables", function(
				result,
				response,
				error
			) {
				Durinn.tests.expect(response.fields).to.be.an("array");
				done();
			});
		});

		it("In SHOW or Select queries, result.insertId should be 0", done => {
			new Durinn.query().exec("SHOW variables", function(
				result,
				response,
				error
			) {
				Durinn.tests.expect(response.insertId).to.be.an("null");
				done();
			});
		});

		it("In SHOW or Select queries, result.changedRows should be 0", done => {
			new Durinn.query().exec("SHOW variables", function(
				result,
				response,
				error
			) {
				Durinn.tests.expect(response.changedRows).to.equals(0);
				done();
			});
		});

		it("In SHOW or Select queries, result.affectedRows should be 0", done => {
			new Durinn.query().exec("SHOW variables", function(
				result,
				response,
				error
			) {
				Durinn.tests.expect(response.affectedRows).to.equals(0);
				done();
			});
		});
	});
}
