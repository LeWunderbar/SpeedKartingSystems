const { EmbedBuilder, PermissionFlagsBits, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { infoMessage, unknowenError } = require("./../../templates/embeds");
const { botAvatar } = require("./../../handlers/clientHandler")
const log = require("./../../utils/log");
const ticketSchema = require("./../../schema/tickets")

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
	permissionsRequired: [PermissionFlagsBits.ManageChannels],

	callback: async(client, interaction) => {
		try {
			const sendChannelId = interaction.options.get("channel").value
			await interaction.deferReply();

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel("General Support")
                    .setCustomId("general_support"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel("Public Relations")
                    .setCustomId("public_relations"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel("Moderation")
                    .setCustomId("moderation"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel("Development")
                    .setCustomId("development") 
            )

			const embed = new EmbedBuilder()
				.setTitle("SpeedKarting Support")
				.setDescription("Some Description")
				.setColor("#f55a42")
				.setFooter({ text: "SpeedKarting Systems", iconURL: botAvatar })
			
			const channel = client.channels.cache.get(sendChannelId)
   			channel.send({ 
				embeds: [embed],
				components: [row],
				ephemeral: true
			})

			await interaction.editReply({
				embeds: [infoMessage("The message has been sent!", "54e858")],
				ephemeral: true
			});

		} catch (err) {
			log(`\x1b[31m[Error] \x1b[32mAn error occurred:\n\x1b[0m${err}`)
			interaction.reply({
				embeds: [unknowenError("/ticket-opener-create-unknowen")],
				ephemeral: true
			});
		}
  	},
}