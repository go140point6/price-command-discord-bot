require('dotenv').config();
const { Client, REST, Routes } = require('discord.js');
const fs = require('node:fs');

client.on(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);

    c.on(
        "interactionCreate",
        async (interaction) => await onInteraction(interaction)
    );
});

/*
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
*/