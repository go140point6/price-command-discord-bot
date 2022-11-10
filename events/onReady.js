const { Client, Events } = require('discord.js');
const client = require('../index');

function onReady(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`)
};

module.exports = { 
    onReady 
}