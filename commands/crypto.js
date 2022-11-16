const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const Database = require('better-sqlite3');

const db = new Database('./data/data.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crypto-price')
        .setDescription('Coin Gecko reported price in USD')
        .addStringOption((option) =>
            option
                .setName("ticker")
                .setDescription("Common ticker (symbol) of cryptocurrency to lookup i.e. XRP.")
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const ticker = (interaction.options.getString("ticker", true)).toUpperCase();
        const stmt5 = db.prepare('SELECT id, symbol FROM crypto WHERE symbol = ? COLLATE NOCASE');
        var results5 = stmt5.all(ticker);

        console.log("Number in array for " + ticker + " is " + results5.length);

        if (Array.isArray(results5) && results5.length == 1) {
            //console.log("Array exists and has exactly 1 item");
            let id = results5[0].id;
            await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`).then(res => {
                //if(res.data && res.data.id.usd) {
                    let result = res.data;
                    console.log(id);
                    //console.log(res.data.id.usd);
                    
                    //inUSD = .toFixed(6);
                    //console.log("Current XRP price: " + inXRP);
                    //console.log("Current XRP price in USD: " + inUSD);
                    //interaction.editReply({ content: `Current price of ${ticker} is USD ${inUSD}` });
                    interaction.editReply({ content: `${result}` });
                //}
            }).catch(err => {
                interaction.editReply({ content: `Some error with api call, please try again or ping my overseer.`});
            });
        } else if (Array.isArray(results5) && results5.length > 1) {
            interaction.editReply({ content: `Found more than one ${ticker} in database and I am not fully programmed for that yet.` });
        } else {
            interaction.editReply({ content: `Sorry, ${ticker} is unknown to me, please ask my overseer to update the database.` });
        }
    }
};