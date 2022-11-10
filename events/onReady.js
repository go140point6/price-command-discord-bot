const { Client, Events } = require('discord.js');
const client = require('../index');

module.exports = {
    name: "onReady.js"
};

client.on(Events.ClientReady, async() => {
    console.log(`Ready! Logged in as ${client.user.tag}`)
});