var validateEnv = function () {
    if (!process.env.BOT_TOKEN) {
        logHandler.log("warn", "Missing Discord bot token.");
        process.exit(1);
    }
};

exports.validateEnv = validateEnv;