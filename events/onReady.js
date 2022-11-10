const client = require("../index");
const { Events } = require('discord.js');

module.exports = {
    name: "onReady.js"
};

client.on(Events.ClientReady, async() => {
    console.log(`Ready! Logged in as ${client.user.tag}`)
});