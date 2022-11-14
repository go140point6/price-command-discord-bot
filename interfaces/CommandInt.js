// Node's native file system module. fs is used to read the commands directory and identify our command files.
const fs = require('node:fs');
// Node's native path utility module. path helps construct paths to access files and directories. One of the advantages of the path module is that it automatically detects the operating system and uses the appropriate joiners.
const path = require('node:path');
const client = require('../index');
const { Collection } = require('discord.js');

const CommandInt = function () {
    client.commands = new Collection();

    const commandsPath = path.join(__dirname, '..', 'commands');
    console.log(commandsPath);

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    console.log(commandFiles);

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        console.log(filePath);
        const command = require(filePath);
        console.log(command);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
};

module.exports = { 
    CommandInt,
    commandFiles 
};