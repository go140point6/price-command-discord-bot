require('dotenv').config();
require('log-timestamp');
const { Client } = require('discord.js');
const { GatewayIntentBits } = require('./config/GatewayIntentBits');
const { validateEnv } = require('./utils/validateEnv');
const { onReady } = require('./events/onReady');

(async () => {
    validateEnv();

    const client = new Client({ intents: GatewayIntentBits });
    module.exports = client;

    client.on('ready', async() => await onReady(client));

    await client.login(process.env.BOT_TOKEN);
})();