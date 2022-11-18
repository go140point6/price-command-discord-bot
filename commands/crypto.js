const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const Database = require('better-sqlite3');
const client = require('../index');

const db = new Database('./data/data.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crupto-price')
        .setDescription('Coin Gecko reported price in USD')
        .addStringOption((option) =>
            option
                .setName("ticker")
                .setDescription("Common ticker (currency) of cryptocurrency to lookup i.e. XRP.")
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const ticker = (interaction.options.getString("ticker", true)).toUpperCase();
        const stmt5 = db.prepare('SELECT id, symbol FROM crypto WHERE symbol = ? COLLATE NOCASE');
        var results5 = stmt5.all(ticker);

        console.log("Number in array for " + ticker + " is " + results5.length);

        let num = 0;
        let embedFields = [];
        if (results5.length >= 1) {
            while (num < results5.length) {
                var id = results5[num].id;
                //var symbol = results5[num].symbol;
                //var name = results5[num].;
                //if (name == null) {
                //    name = currency;
                //}
                await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`).then(res => {
                    if(res.data) {
                        var symbol = res.data[0].symbol
                        var name = res.data[0].name
                        var price = res.data[0].market_data.current_price.usd
                        var image = res.data[0].image.small
                        embedFields.push({ name: name, value: price });
                        }
                    }).catch(err => {
                        interaction.editReply({ content: err});
                    });
                    num++;
                }
                let fields = embedFields;

                const embedToken = new EmbedBuilder()
                    .setColor('DarkGreen')
                    .setTitle(`Welcome to The Terminal`)
                    .setAuthor({ name: client.user.username })
                    .setDescription(`The query results for ${symbol}:`)
                    .setThumbnail(client.user.avatarURL())
                    .addFields(fields)
                    .setImage(image)
                    .setTimestamp()
                    //.setFooter({ text: 'Some footer text here', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/481px-Cat03.jpg' });

                    interaction.editReply({ embeds: [embedToken]});
            } else {
            interaction.editReply({ content: `Sorry, ${ticker} is unknown to me, please ask my overseer to update the database.` });
        }
    }
};