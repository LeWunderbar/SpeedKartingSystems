const { EmbedBuilder, PermissionFlagsBits, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { infoMessage, unknowenError } = require("./../../templates/embeds");
const log = require("./../../utils/log");

const tickets = require("./../../schema/tickets")

module.exports = {
	name: 'test',
	description: 'testing!',
	// devOnly: Boolean,
	// testOnly: Boolean,
	// options: Object[],
	//deleted: true,
	// permissionsRequired: // EXSAMPLE: [PermissionFlagsBits.Administrator],
	// botPermissions: 

	callback: async(client, interaction) => {
		try {

			const allTickets = await tickets.find()

			console.log(allTickets)

			interaction.reply({
				embeds: [infoMessage("Testing!")],
				ephemeral: true
			});

		} catch (err) {
			log(`\x1b[31m[Error] \x1b[32mAn error occurred:\n\x1b[0m${err}`)
			interaction.reply({
				embeds: [unknowenError("/test-unknowen")],
				ephemeral: true
			});
		}
  	},
}