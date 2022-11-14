//const onReady = require('./onReady');
const XRP = require('./onReady');
const axios = require('axios');
const Database = require('better-sqlite3');
const db = new Database('./data/tokens.db');

async function onInteraction(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');
        } else if (commandName === 'beep') {
        await interaction.reply('Boop!');
        } else if (commandName === 'xrpl-token') {
        await interaction.deferReply();

        const ticker = (interaction.options.getString("ticker", true)).toUpperCase();
        const stmt5 = db.prepare('SELECT currency, issuer FROM tokens WHERE currency = ? COLLATE NOCASE');
        var results5 = stmt5.all(ticker);

        console.log("Current XRP price is $" + getXRP.price);
        console.log("Number in array for " + ticker + " is " + results5.length);

        if (Array.isArray(results5) && results5.length == 1) {
            //console.log("Array exists and has exactly 1 item");
            let currency = results5[0].currency;
            let issuer = results5[0].issuer;
            await axios.get(`https://api.onthedex.live/public/v1/ticker/${currency}.${issuer}:XRP`).then(res => {
                if(res.data && res.data.pairs[0].last) {
                    const inXRP = res.data.pairs[0].last;
                    inUSD = (inXRP * getXRP.price).toFixed(6);
                    console.log("Current XRP price: " + inXRP);
                    console.log("Current XRP price in USD: " + XRP);
                    //interaction.editReply({ content: `Current price of ${ticker} is USD ${inUSD}` });
                    interaction.editReply({ content: "589!"})
                }
            }).catch(err => {
                interaction.editReply({ content: `Some error with api call, please try again or ping an admin.`});
            });
        } else if (Array.isArray(results5) && results5.length > 1) {
            interaction.editReply({ content: `Found more than one ${ticker} in database and the meatbag didn't program me for that yet.` });
        } else {
            interaction.editReply({ content: `Sorry, the meatbag didn't program me for ${ticker}, please ask him to update the database.` });
        }
    }
};

module.exports = { 
    onInteraction
}