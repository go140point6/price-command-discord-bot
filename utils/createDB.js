// Stand-alone script to create the initial DB of tokens
// node createDB.js
const axios = require('axios');
const Database = require('better-sqlite3');

const db = new Database('../data/tokens.db', {verbose: console.log });

var tableName = "tokens";
var fields = "(issuer TEXT PRIMARY KEY NOT NULL, currency TEXT, name TEXT, logo_file TEXT)";
var sql = `CREATE TABLE IF NOT EXISTS ${tableName} ${fields}`;
const createTable = db.prepare(sql);
createTable.run();

async function getTokens() {
    await axios.get(`https://api.onthedex.live/public/v1/aggregator`).then(res => {
        console.log(res.data.tokens);
        const insert = db.prepare(`INSERT INTO tokens (issuer, currency, name, logo_file) VALUES (@issuer, @currency, @name, @logo_file)`);
        //var insertQuery = "INSERT INTO tokens VALUES (?,?,?,?,?)";

        const insertMany = db.transaction((tokens) => {
            for (const token of tokens) insert.run(token)
        })

        insertMany(res.data.tokens);
    });
};

async function grabTokens() {
    await getTokens();
    const stmt = db.prepare("SELECT * FROM tokens");
    var results = stmt.all();
    console.log(results);
}

grabTokens();