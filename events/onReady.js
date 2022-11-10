const client = require("..");

client.on(Events.ClientReady, client => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
});