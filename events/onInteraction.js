const { onInteraction } = require('discord.js');

// Define an exported async function, with a parameter 'interaction'
module.exports.onInteraction = async (interaction) => {
    if (interaction.isCommand()) {
        console.log("good job");
    }
};