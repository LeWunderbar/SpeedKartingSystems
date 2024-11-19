const { PermissionFlagsBits, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { infoMessage, unknowenError } = require("./../../../templates/embeds");
const { config } = require("./../../../configurator")
const log = require("./../../../utils/log");

module.exports = {
	name: 'ticket-add',
	description: 'Add a user to current ticket',
	options: [
		{
			name: "discord-user",
			description: "The discord user to add",
			required: true,
			type: ApplicationCommandOptionType.User
		}
	  ],
	botPermissions: [PermissionFlagsBits.ManageChannels],
	testOnly: true,
	deleted: true,
  
	callback: async (client, interaction) => {
	},
  };
  