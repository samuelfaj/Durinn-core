import Durinn from "../durinn";
import { Pool } from "mysql";
import * as MySQL from "mysql";

export default class {
	public static get connection(): Pool {
		return MySQL.createPool(Durinn.config.database);
	}

	public static get object(): object {
		return MySQL;
	}
}
