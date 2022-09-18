import pool from "../configs/database/database";

export const querySelect = async (query: string, values: string[]) => {
    try {
        const response = await pool.query(query, values);
        const result = JSON.parse(JSON.stringify(response));
        return result;
    } catch (error: any) {
        throw new Error(error);
    }
};
