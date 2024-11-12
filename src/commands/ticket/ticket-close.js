const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const { infoMessage, unknowenError } = require("./../../templates/embeds");
const { config } = require("./../../configurator")
const Tickets = require("./../../schema/tickets");
const log = require("./../../utils/log");

module.exports = {
    name: 'ticket-close',
    description: 'Close an open ticket',
    botPermissions: [PermissionFlagsBits.ManageChannels],

    callback: async (client, interaction) => {
        try {
            const channelId = interaction.channel.id
            const ticket = await Tickets.find({ channelId: channelId }).exec();

            const botAvatar = client.user.displayAvatarURL({
                format: 'png',
                size: 512
            });

            if (ticket.length === 0) {
                interaction.reply({
                    embeds: [infoMessage("This command can only be run inside a ticket!")],
                    ephemeral: true,
                });
            } else {
                const Owner = await client.users.fetch(ticket[0].userId)
                const channel = client.channels.cache.get(ticket[0].channelId)
                const ChannelNameString = "`#" + channel.name + "`"
                const TicketOwnerUserString = "`@" + Owner.username + "`"
                const LogEmbed = new EmbedBuilder()
                    .setAuthor({ name: `Ticket: ${channel.name}`})
                    .setTitle("Ticket Closed")
                    .setDescription(`**Owner:** <@${ticket[0].userId}> ${TicketOwnerUserString} (${ticket[0].userId})\n**Closed by:** <@${interaction.user.id}> (${interaction.user.id})\n**Channel:** ${ChannelNameString} (${channel.id})`)
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
            }
        } catch (err) {
            log(`\x1b[31m[Error] \x1b[32mAn error occurred:\n\x1b[0m${err}`)
			interaction.reply({
				embeds: [unknowenError("/ticket-close-unknowen")],
				ephemeral: true
			});
        }
    },
};
