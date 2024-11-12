const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const { infoMessage, unknowenError } = require("./../../../templates/embeds");
const { config } = require("./../../../configurator")
const log = require("./../../../utils/log");
const Tickets = require("./../../../schema/tickets");

module.exports = {
	buttonId: 'closeTicket',
	callback: async (client, interaction) => {
		try {
			const channelId = interaction.channel.id
			const ticket = await Tickets.find({ channelId: channelId }).exec();

			const botAvatar = client.user.displayAvatarURL({
                format: 'png',
                size: 512
            });
			
			const Owner = await client.users.fetch(ticket[0].userId)
            const ChannelNameString = "`#" + interaction.channel.name + "`"
            const TicketOwnerUserString = "`@" + Owner.username + "`"
            const LogEmbed = new EmbedBuilder()
                .setAuthor({ name: `Ticket: ${interaction.channel.name}`})
                .setTitle("Ticket Closed")
                .setDescription(`**Owner:** <@${ticket[0].userId}> ${TicketOwnerUserString} (${ticket[0].userId})\n**Closed by:** <@${interaction.user.id}> (${interaction.user.id})\n**Channel:** ${ChannelNameString} (${channelId})`)
                .setTimestamp()
                .setColor("#cc2d14")
                .setFooter({ text: "SpeedKarting Systems", iconURL: botAvatar })    

            const logChannel = client.channels.cache.get(config.TicketLogChannel)
            await logChannel.send({
                embeds: [LogEmbed],
                ephemeral: false
            })

			await Tickets.deleteOne({ channelId: channelId })
			interaction.channel.delete()
		} catch (err) {
			log(`\x1b[31m[Error] \x1b[32mAn error occurred while pressing a button:\n\x1b[0m${err}`);
			interaction.reply({
				embeds: [unknowenError("button-tickets-closeTicket-unknowen")],
				ephemeral: true
			});
		}
	},
};