const { EmbedBuilder, PermissionFlagsBits, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { infoMessage, unknowenError } = require("./../../../templates/embeds");
const { botAvatar } = require("./../../../handlers/clientHandler")
const log = require("./../../../utils/log");

module.exports = {
	name: 'ticket-opener-create',
	description: 'Create Ticket Opener Message',
	options: [
		{
			name: "channel",
			description: "The channel to send the ticket opener to",
			required: true,
			type: ApplicationCommandOptionType.Channel,
		}
	],
	permissionsRequired: [PermissionFlagsBits.Administrator],
	botPermissions: [PermissionFlagsBits.ManageChannels],
	testOnly: true,
	deleted: true,

	callback: async(client, interaction) => {
  	},
}