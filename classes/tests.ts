import { expect, should, assert } from "chai";
import * as Mocha from "mocha";

export default class {
	public static get mocha() {
		return Mocha;
	}

	public static get expect() {
		return expect;
	}

	public static get should() {
		return should;
	}

	public static get assert() {
		return assert;
	}
}
