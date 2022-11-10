require('dotenv').config();
// Node's native file system module. fs is used to read the commands directory and identify our command files.
const fs = require('node:fs');
// Node's native path utility module. path helps construct paths to access files and directories. One of the advantages of the path module is that it automatically detects the operating system and uses the appropriate joiners.
const path = require('node:path');
const client = require('../index');
const { REST, Routes } = require('discord.js');

function onReady(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`)
};

module.exports = { 
    onReady 
}

