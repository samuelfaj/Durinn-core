/// <reference types="chai" />
import * as Mocha from "mocha";
export default class {
    static readonly mocha: typeof Mocha;
    static readonly expect: Chai.ExpectStatic;
    static readonly should: () => Chai.Should;
    static readonly assert: Chai.AssertStatic;
}
