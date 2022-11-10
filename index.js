require('dotenv').config();
require('log-timestamp');
// Node's native file system module. fs is used to read the commands directory and identify our command files.
const fs = require('node:fs');
// Node's native path utility module. path helps construct paths to access files and directories. One of the advantages of the path module is that it automatically detects the operating system and uses the appropriate joiners.
const path = require('node:path');
const { Client, Events} = require('discord.js');
const { GatewayIntentBits } = require('./config/GatewayIntentBits');
const { validateEnv } = require('./utils/validateEnv');
const { onInteraction } = require('./events/onInteraction');

(async () => {
    validateEnv();

    const client = new Client({ intents: GatewayIntentBits });

    // extends JavaScript's native Map class, and includes more extensive, useful functionality. Collection is used to store and efficiently retrieve commands for execution.
    client.commands = new Collection();

    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
	    const filePath = path.join(commandsPath, file);
	    const command = require(filePath);
	    // Set a new item in the Collection with the key as the command name and the value as the exported module
	    if ('data' in command && 'execute' in command) {
    		client.commands.set(command.data.name, command);
	    } else {
		    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    	}
    }

    module.exports = client;

    client.on(Events.ClientReady, c => {
        console.log(`Ready! Logged in as ${c.user.tag}`);

        c.on(
            "interactionCreate",
            async (interaction) => await onInteraction(interaction)
        );
    });

    client.on(Events.InteractionCreate, interaction => {
        if (!interaction.isChatInputCommand()) return;
        console.log(interaction);
    });

    await client.login(process.env.BOT_TOKEN);
})();