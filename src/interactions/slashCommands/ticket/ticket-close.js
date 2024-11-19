const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const { infoMessage, unknowenError } = require("./../../../templates/embeds");
const { config } = require("./../../../configurator")
const log = require("./../../../utils/log");

module.exports = {
    name: 'ticket-close',
    description: 'Close an open ticket',
    botPermissions: [PermissionFlagsBits.ManageChannels],
    testOnly: true,
    deleted: true,

    callback: async (client, interaction) => {
        
    },
};
