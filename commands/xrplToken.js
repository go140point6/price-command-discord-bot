const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const XRP = require('../events/onReady');
const axios = require('axios');
const Database = require('better-sqlite3');
const client = require('../index');

const db = new Database('./data/data.db');

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
        const stmt5 = db.prepare('SELECT currency, issuer, name, logo_file FROM xrplTokens WHERE currency = ? COLLATE NOCASE');
        var results5 = stmt5.all(ticker);

        console.log("Current XRP price is $" + XRP.currentXRP);
        console.log("Number in array for " + ticker + " is " + results5.length);

        let currency = results5[0].currency;
        let issuer = results5[0].issuer;
        let name = results5[0].name;
        let logo_file = results5[0].logo_file;
        console.log(currency);
        console.log(issuer);
        console.log(name);
        console.log(logo_file);

        let numOfTokens = [];
        console.log(results5);
        for (const result of results5) {
            numOfTokens.push(result)
        }

        

        //if (Array.isArray(results5) && results5.length == 1) {
            //console.log("Array exists and has exactly 1 item");
            await axios.get(`https://api.onthedex.live/public/v1/ticker/${currency}.${issuer}:XRP`).then(res => {
                if(res.data && res.data.pairs[0].last) {
                    const inXRP = res.data.pairs[0].last;
                    const inUSD = (inXRP * XRP.currentXRP).toFixed(6);
                    //console.log("Current XRP price: " + inXRP);
                    //console.log("Current XRP price in USD: " + inUSD);
                    //interaction.editReply({ content: `Current price of ${ticker} is USD ${inUSD}` });
                    console.log(`User tag: ${client.user.tag}`);
                    console.log(`User avatar URL: ${client.user.avatarURL()}`)
                    console.log(`User username: ${client.user.username}`);

                    console.log(numOfTokens[2].name);
                    console.log(inUSD);

                    function createEmbedFields(numArray) {
                        let embedFields = [];
                        let num = 0;
                        while (num < numArray) {
                            console.log(num);
                            console.log(numOfTokens[num].name);
                            console.log(numOfTokens[num].inUSD);
                            //embedFields.push({ name: numOfTokens[num].name, value: numOfTokens[num].inUSD})
                            embedFields.push({ name: 'ticker', value: 'inUSD' });
                            num++
                        }
                        return embedFields;
                    }
            
                    let fields = createEmbedFields(results5.length);

                    const embedToken = new EmbedBuilder()
                        .setColor('DarkRed')
                        .setTitle(`Welcome to The Terminal`)
                        .setAuthor({ name: client.user.username })
                        .setDescription(`The query results for ${ticker}:`)
                        .setThumbnail(client.user.avatarURL())
                        .addFields(
                            fields
                            //{ name: ticker, value: inUSD },
                            //{ name: ticker, value: inUSD },
                            //{ name: ticker, value: inUSD },
                            //{ name: 'Inline field title', value: 'Some value here', inline: true },
                            //{ name: 'Inline field title', value: 'Some value here', inline: true },
                        )
                        .setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
                        .setTimestamp()
                        .setFooter({ text: 'Some footer text here', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/481px-Cat03.jpg' });

                    /*
                    const embedPing = new EmbedBuilder()
                        .setTitle('Ping!')
                        .addFields(
                            { name: 'Ping', value: 'Pong!'},
                        );
                    */
                    interaction.editReply({ embeds: [embedToken]});
                }
            }).catch(err => {
                interaction.editReply({ content: `Some error with api call, please try again or ping my overseer.`});
            });
        //} else if (Array.isArray(results5) && results5.length > 1) {
        //    interaction.editReply({ content: `Found more than one ${ticker} in database and I am not fully programmed for that yet.` });
        //} else {
        //    interaction.editReply({ content: `Sorry, ${ticker} is unknown to me, please ask my overseer to update the database.` });
        //}
    }
};