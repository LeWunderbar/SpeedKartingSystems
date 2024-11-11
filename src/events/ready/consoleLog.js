const { Client, IntentsBitField, EmbedBuilder, Guild } = require("discord.js");
const {config} = require("../../configurator")
const log = require("../../utils/log")

module.exports = (client) => {
    log(`\x1b[38;2;144;190;109m[Client] \x1b[32m${client.user.username} \u001b[37mis connected and service Online.`)

    client.user.setActivity({name: config.BOT_STATUS});

    const embed = new EmbedBuilder()
        .setTitle("Online")
        .setColor("Green")
        .setAuthor({ name: "Bot: " + client.user.tag + " (" + client.user.id + ")", iconURL: client.user.avatarURL()})
    const channel = client.channels.cache.get(config.LOG_CHANNEL)
    channel.send({ embeds: [embed] })
};