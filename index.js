require('dotenv').config();
require('log-timestamp');
// Node's native file system module. fs is used to read the commands directory and identify our command files.
const fs = require('node:fs');
// Node's native path utility module. path helps construct paths to access files and directories. One of the advantages of the path module is that it automatically detects the operating system and uses the appropriate joiners.
const path = require('node:path');
const { Client, Collection, Events } = require('discord.js');
const { GatewayIntentBits } = require('./config/GatewayIntentBits');
const { onReady } = require('./events/onReady');
const { validateEnv } = require('./utils/validateEnv');
const { CommandInt } = require('./interfaces/CommandInt');

(async () => {
    validateEnv();

    const client = new Client({ intents: GatewayIntentBits });
    module.exports = client;

    await CommandInt()

    client.on(Events.ClientReady, async() => await onReady(client));
    
    await client.login(process.env.BOT_TOKEN);
})();