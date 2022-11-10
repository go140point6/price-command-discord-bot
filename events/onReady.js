require('dotenv').config();
// Node's native file system module. fs is used to read the commands directory and identify our command files.
const fs = require('node:fs');
// Node's native path utility module. path helps construct paths to access files and directories. One of the advantages of the path module is that it automatically detects the operating system and uses the appropriate joiners.
const path = require('node:path');
const client = require('../index');
const { REST, Routes } = require('discord.js');

function onReady(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`)

    const commands = [];
    // Grab all the command files from the commands directory 
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
	    const command = require(`./commands/${file}`);
	    commands.push(command.data.toJSON());
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

    // and deploy your commands!
    (async () => {
	    try {
		    // The put method is used to fully refresh all commands in the guild with the current set.
		    const data = await rest.put(
			    Routes.applicationGuildCommands(
                    process.env.CLIENT_ID, 
                    process.env.GUILD_ID
                    ),
			    { body: commands },
		    );

		    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	    } catch (error) {
		    // Catch and log any errors.
		    console.error(error);
	    }
    })();
};

module.exports = { 
    onReady 
}