const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const Database = require('better-sqlite3');
const client = require('../index');

const db = new Database('./data/data.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crypto-price')
        .setDescription('Coin Gecko reported price in USD')
        .addStringOption((option) =>
            option
                .setName("ticker")
                .setDescription("Common ticker symbol of cryptocurrency to lookup i.e. XRP.")
                .setRequired(true)
        ),
        async execute(interaction) {
            await interaction.deferReply();
    
            const ticker = (interaction.options.getString("ticker", true)).toUpperCase();
            const stmt5 = db.prepare('SELECT id, symbol FROM crypto WHERE symbol = ? COLLATE NOCASE');
            var results5 = stmt5.all(ticker);
    
            console.log("Number in array for " + ticker + " is " + results5.length);
    
            let num = 0;
            if (results5.length >= 1) {
                let embedFields = [];
                while (num < results5.length) {
                    var id = results5[num].id;
                    console.log(id)                    
                    await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`).then(res => {
                        if(res.data) {
                            var name = res.data.name;
                            var price = res.data.market_data.current_price.usd;
                            console.log(name);
                            console.log(price);
                            //embedFields.push({ name: name, value: price });
                            embedFields.push({ name: 'jojo', value: 'juju' });
                            }
                        }).catch(err => {
                            interaction.editReply({ content: err});
                        });
                        num++;
                    }
                    //let fields = embedFields;
    
                    const embedToken = new EmbedBuilder()
                        .setColor('DarkGreen')
                        .setTitle(`Welcome to The Terminal`)
                        .setAuthor({ name: client.user.username })
                        .setDescription(`The query results for ${ticker}:`)
                        .setThumbnail(client.user.avatarURL())
                        .addFields(embedFields)
                        //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
                        .setTimestamp()
                        //.setFooter({ text: 'Some footer text here', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/481px-Cat03.jpg' });
    
                        interaction.editReply({ embeds: [embedToken]});
                } else {
                interaction.editReply({ content: `Sorry, ${ticker} is unknown to me, please ask my overseer to update the database.` });
            }
        }
    };
    /*        
                await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`).then(res => {
                    if(res.data) {
                        var symbol = res.data.symbol
                        var name = res.data.name
                        var price = res.data.market_data.current_price.usd
                        //var image = res.data.image.small
                        console.log(symbol)
                        console.log(name)
                        console.log(price)
                        //console.log(image)
                        //embedFields.push({ name: name, value: price });
                        embedFields.push({ name: "jojo", value: "100" });
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
                    //.setAuthor({ name: client.user.username })
                    .setDescription(`The query results for ${ticker}:`)
                    //.setThumbnail(client.user.avatarURL())
                    .addFields(fields)
                    //.setImage(image)
                    .setTimestamp()
                    //.setFooter({ text: 'Some footer text here', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/481px-Cat03.jpg' });

                    interaction.editReply({ embeds: [embedToken]});
            } else {
            interaction.editReply({ content: `Sorry, ${ticker} is unknown to me, please ask my overseer to update the database.` });
        }
    }
};
*/