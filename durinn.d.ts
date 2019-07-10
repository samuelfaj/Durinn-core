import Tests from "./classes/tests";
import Query from "./helpers/query";
export default class {
	static readonly pool: any;
	static readonly config: any;
	static readonly database: any;
	static readonly tests: typeof Tests;
	static readonly query: typeof Query;
}
