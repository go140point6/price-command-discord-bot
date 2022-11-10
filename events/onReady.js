const client = require("..");
const { Events } = require('discord.js');

client.on(Events.ClientReady, client => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
});