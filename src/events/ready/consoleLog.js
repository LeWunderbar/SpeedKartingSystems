const { Client, IntentsBitField, EmbedBuilder, Guild } = require("discord.js");
const {config} = require("../../launch")
const log = require("../../utils/log")

module.exports = (client) => {
    const c = client
    log('The Bot "' + c.user.tag + '" is now online!')
    c.user.setActivity({name: config.BOT_STATUS});
    const embed = new EmbedBuilder()
    .setTitle("Online")
    .setColor("Green")
    .setAuthor({ name: "Bot: " + c.user.tag + " (" + c.user.id + ")", iconURL: c.user.avatarURL()})
    const channel = client.channels.cache.get(config.LOG_CHANNEL)
    channel.send({ embeds: [embed] })
};