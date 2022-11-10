require('dotenv').config();
require('log-timestamp');
const { Client, Collection, Events } = require('discord.js');
const { GatewayIntentBits } = require('./config/GatewayIntentBits');
const { onReady } = require('./events/onReady');
const { validateEnv } = require('./utils/validateEnv');

(async () => {
    validateEnv();

    const client = new Client({ intents: GatewayIntentBits });
    module.exports = client;

    client.commands = new Collection();

    client.on(Events.ClientReady, async() => await onReady(client));
    
    await client.login(process.env.BOT_TOKEN);
})();