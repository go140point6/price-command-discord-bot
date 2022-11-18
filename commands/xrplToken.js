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

        //let currency = results5[0].currency;
        //let issuer = results5[0].issuer;
        //let name = results5[0].name;
        //let logo_file = results5[0].logo_file;
        //console.log(currency);
        //console.log(issuer);
        //console.log(name);
        //console.log(logo_file);

        let numOfTokens = [];
        //console.log(results5);
        for (const result of results5) {
            numOfTokens.push(result)
            //console.log(result);
        }

        //console.log(numOfTokens[0]);
        //console.log(numOfTokens[1]);
        //console.log(numOfTokens[2]);
        
        let num = 0;
        let embedFields = [];
        if (results5.length >= 1) {
            while (num < results5.length) {
                let currency = results5[num].currency;
                let issuer = results5[num].issuer;
                let name = results5[num].name;
                if (name == null) {
                    name = currency;
                console.log(currency);
                console.log(issuer);
                console.log(name);
                await axios.get(`https://api.onthedex.live/public/v1/ticker/${currency}.${issuer}:XRP`).then(res => {
                    if(res.data && res.data.pairs[0].last) {
                        let inXRP = res.data.pairs[0].last;
                        let inUSD = (inXRP * XRP.currentXRP).toFixed(6);
                        embedFields.push({ name: ticker, value: inUSD });
                        //console.log(inXRP);
                        //console.log(inUSD);
                        }
                    }).catch(err => {
                        interaction.editReply({ content: err});
                    });
                    num++;
                }
            //return embedFields;
                console.log("embedFields: " + embedFields);
                let fields = embedFields;

                const embedToken = new EmbedBuilder()
                    .setColor('DarkRed')
                    .setTitle(`Welcome to The Terminal`)
                    .setAuthor({ name: client.user.username })
                    .setDescription(`The query results for ${name}:`)
                    .setThumbnail(client.user.avatarURL())
                    .addFields(fields)
                    //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
                    .setTimestamp()
                    //.setFooter({ text: 'Some footer text here', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/481px-Cat03.jpg' });

                    /*
                    const embedPing = new EmbedBuilder()
                        .setTitle('Ping!')
                        .addFields(
                            { name: 'Ping', value: 'Pong!'},
                        );
                    */
                    interaction.editReply({ embeds: [embedToken]});
            } 
        }else {
            interaction.editReply({ content: `Sorry, ${ticker} is unknown to me, please ask my overseer to update the database.` });
        }
    }
};