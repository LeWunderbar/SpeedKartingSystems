const { EmbedBuilder, PermissionFlagsBits, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { infoMessage, unknowenError } = require("./../../../templates/embeds");
const { botAvatar } = require("./../../../handlers/clientHandler")
const log = require("./../../../utils/log");
const ticketSchema = require("./../../../schema/tickets")

module.exports = {
	name: 'verify-message',
	description: 'Send Message with button to verify',
	options: [
		{
			name: "channel",
			description: "The channel to send the message to",
			required: true,
			type: ApplicationCommandOptionType.Channel,
		}
	],
	permissionsRequired: [PermissionFlagsBits.Administrator],

	callback: async(client, interaction) => {
		try {
			const sendChannelId = interaction.options.get("channel").value
			await interaction.deferReply();

			const botAvatar = client.user.displayAvatarURL({
                format: 'png',
                size: 512
            });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Success)
                    .setLabel("Verify")
                    .setCustomId("verifyBtn"),
            )

			const embed = new EmbedBuilder()
				.setTitle("Verification")
				.setDescription("Welcome to SpeedKarting! Click the button below to verify and gain access to the rest of the server.")
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
				embeds: [unknowenError("/verify-message-unknowen")],
				ephemeral: true
			});
		}
  	},
}