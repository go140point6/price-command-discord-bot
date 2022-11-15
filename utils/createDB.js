// Stand-alone script to create the initial DB of tokens
// node createDB.js
const axios = require('axios');
const Database = require('better-sqlite3');

const db = new Database('../data/tokens.db', {verbose: console.log });

var tableName = "tokens";
var fields = "(id INTEGER PRIMARY KEY AUTOINCREMENT, currency TEXT, issuer TEXT, name TEXT, logo_file TEXT)";
var sql = `CREATE TABLE IF NOT EXISTS ${tableName} ${fields}`;
const createTable = db.prepare(sql);
createTable.run();

async function getTokens() {
    await axios.get(`https://api.onthedex.live/public/v1/aggregator`).then(res => {
        //console.log(res.data.tokens);
        let id = null;
        const insert = db.prepare(`INSERT INTO tokens (id, currency, issuer, name, logo_file) VALUES (${id}, @currency, @issuer, @name, @logo_file)`);

        const insertMany = db.transaction((tokens) => {
            for (const token of tokens) {
                if (token.name == null) {
                    token.name = "jojo";
                    //console.log(token.name);
                }
            console.log(token.name);
            }
            //insert.run(token)
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