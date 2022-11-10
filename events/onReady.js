const client = require("..");
const { Events } = require('discord.js');

const onReady = async (client) => {
    client.on(Events.ClientReady, client => {
        console.log(`Ready! Logged in as ${client.user.tag}`);
    });
}