const client = require("..");

Client.on(Events.ClientReady, client => {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    client.on(
        "interactionCreate",
        async (interaction) => await onInteraction(interaction)
    );
});
