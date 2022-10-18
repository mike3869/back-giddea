import { MysqlError, PoolConnection } from "mysql";
import pool from "../configs/database/database";

export const queryBulkInsert = async (query: string, values: any[]) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err: MysqlError, connection: PoolConnection) => {
      if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
          connection.release();
          return reject(new Error("Database connection was closed"));
        }
        if (err.code === "ER_CON_COUNT_ERROR") {
          connection.release();
          return reject(new Error("Database has to many connections"));
        }
        if (err.code === "ECONNREFUSED") {
          connection.release();
          return reject(new Error("Database connection was refused"));
        }
        connection.release();
        return reject(new Error(err.message));
      }
      connection.beginTransaction((error) => {
        if (error) {
          connection.release();
          return reject(new Error("Database connection to begin transaction"));
        }
        connection.query(query, values, (err: any, result, fields) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              return reject(new Error(err));
            });
          }
          connection.commit((error) => {
            if (error) {
              return connection.rollback(() => {
                connection.release();
                return reject(new Error(err));
              });
            }
            connection.release();
            return resolve(JSON.parse(JSON.stringify(result)));
          });
        });
      });
    });
  });
};

export const querySelect = async (query: string, values: any[]) => {
  return new Promise((resolve, reject) => {
    pool.query(query, values, (err: any, result: any, fields) => {
      if (err) {
        return reject(new Error(err));
      }
      return resolve(JSON.parse(JSON.stringify(result)));
    });
  });
};
