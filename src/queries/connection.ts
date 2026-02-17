import mysql, { type Connection } from 'mysql2';

const con: Connection = mysql.createConnection({
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
})

export default con;