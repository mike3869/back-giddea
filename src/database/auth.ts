import { executeQuery } from "../utils/sql-query.util";

export const authLogin = async (_user: string, _pass: string) => {
  try {
    const query = `SELECT username FROM user WHERE username = ? and password = ?`;
    const result = await executeQuery(query, [_user, _pass]);
    return result;
  } catch (error) {
    throw error;
  }
};
