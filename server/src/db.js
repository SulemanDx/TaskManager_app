
const { loadEnvFile } = require('node:process');
loadEnvFile('../.env');

const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,

    onConnect: async (client) => {
        console.log("Connectied to DB..");
        console.log(await pool.query("SELECT * FROM tasks"));
        //pool.end();
    }
});

pool.connect();
//pool.end();
//module.exports = pool;