import Durinn from "../durinn";
import { Pool } from "mysql2";
import * as MySQL from "mysql";

export default class {
	public static get connection(): Pool {
		return Durinn.pool;
	}

	public static get object(): object {
		return MySQL;
	}
}
