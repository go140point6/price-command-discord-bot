const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xrpl-token')
        .setDescription('Last trade in USD')
        .addStringOption((option) =>
            option
                .setName("ticker")
                .setDescription("Common ticker (currency) of XRPL Token to lookup i.e. CLUB.")
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const ticker = (interaction.options.getString("ticker", true)).toUpperCase();
        const stmt5 = db.prepare('SELECT currency, issuer FROM tokens WHERE currency = ? COLLATE NOCASE');
        var results5 = stmt5.all(ticker);

        console.log("Current XRP price is $" + XRP.currentXRP);
        console.log("Number in array for " + ticker + " is " + results5.length);

        if (Array.isArray(results5) && results5.length == 1) {
            //console.log("Array exists and has exactly 1 item");
            let currency = results5[0].currency;
            let issuer = results5[0].issuer;
            await axios.get(`https://api.onthedex.live/public/v1/ticker/${currency}.${issuer}:XRP`).then(res => {
                if(res.data && res.data.pairs[0].last) {
                    const inXRP = res.data.pairs[0].last;
                    inUSD = (inXRP * XRP.currentXRP).toFixed(6);
                    //console.log("Current XRP price: " + inXRP);
                    //console.log("Current XRP price in USD: " + inUSD);
                    interaction.editReply({ content: `Current price of ${ticker} is USD ${inUSD}` });
                }
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