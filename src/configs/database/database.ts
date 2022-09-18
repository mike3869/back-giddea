import * as mysql from "mysql";
import { promisify } from "util";
import { environment } from "../config";

const setting = environment();

const HOST = setting.DB.MYSQL[0].SERVER || "";
const USER = setting.DB.MYSQL[0].USER || "";
const PASSWORD = setting.DB.MYSQL[0].PASSWORD || "";
const DATABASE = setting.DB.MYSQL[0].DATABASE || "";
const CONNECTION_LIMIT = setting.DB.MYSQL[0].CONNECTION_LIMIT || "";

const config = {
  connectionLimit: CONNECTION_LIMIT,
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
};

const pool: any = mysql.createPool(config);

pool.getConnection((err: any, connection: any) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has to many connections");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused");
    }
  }

  if (connection) connection.release();
  console.log("DB is Connected");

  return;
});

pool.query = promisify(pool.query);

export default pool;
