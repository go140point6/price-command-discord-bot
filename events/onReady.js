const { Client, Events } = require('discord.js');
const client = require('../index');

module.exports = {
    name: "onReady.js"
};

function onReady(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`)
};