require('dotenv').config();
require('log-timestamp');
const { Client } = require('discord.js');
const { GatewayIntentBits } = require('./config/GatewayIntentBits');
const { validateEnv } = require('./utils/validateEnv');

(async () => {
    validateEnv();

    const client = new Client({ intents: GatewayIntentBits });

    Client.on(Events.ClientReady, client => {
        console.log(`Ready! Logged in as ${client.user.tag}`);
    });
    
    await client.login(process.env.BOT_TOKEN);
})();