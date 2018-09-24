import Durinn from "../durinn";

Durinn.tests.mocha.describe("An example of Unit Test", () => {
	it("Should be less than 100", () => {
		const result = Math.random();
		Durinn.tests.expect(result).to.lessThan(100);
	});
});
