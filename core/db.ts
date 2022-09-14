// import mysql from require("mysql2/promise");
import mysql from "mysql2/promise";

export const query = async (sql: any, params: any) => {
  const connection = await mysql.createConnection(
    `${process.env.DATABASE_URL}`
  );
  const [results] = await connection.execute(sql, params);

  return results;
}
