const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const { infoMessage, unknowenError } = require("./../../../templates/embeds");
const log = require("./../../../utils/log");
const createTicket = require("./../../../utils/createTicket")
const { config } = require("./../../../configurator")

module.exports = {
	buttonId: 'development',
	callback: async (client, interaction) => {
		try {
			const supportRoleIds = config.DevelopmentHelpers
			await createTicket(interaction, client, supportRoleIds)

		} catch (err) {
			log(`\x1b[31m[Error] \x1b[32mAn error occurred while pressing a button:\n\x1b[0m${err}`);
			interaction.reply({
				embeds: [unknowenError("button-tickets-development-unknowen")],
				ephemeral: true
			});
		}
	},
};