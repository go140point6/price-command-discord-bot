require('dotenv').config();
require('log-timestamp');
const { Client, Events } = require('discord.js');
const { GatewayIntentBits } = require('./config/GatewayIntentBits');
const { validateEnv } = require('./utils/validateEnv');
//const { onReady } = require('./events/onReady');

(async () => {
    validateEnv();

    const client = new Client({ intents: GatewayIntentBits });

    client.on(Events.ClientReady, async() => {
        console.log(`Ready! Logged in as ${client.user.tag}`)
    });
    
    /*
    await onReady(client));
    module.exports = client;
    */

    await client.login(process.env.BOT_TOKEN);
})();