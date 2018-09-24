import Mysql from "./classes/mysql";
import Tests from "./classes/tests";
import Query from "./helpers/query";
export default class {
    static readonly config: any;
    static readonly database: typeof Mysql;
    static readonly tests: typeof Tests;
    static readonly query: typeof Query;
}
