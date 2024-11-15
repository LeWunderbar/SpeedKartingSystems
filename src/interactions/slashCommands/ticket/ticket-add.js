const { PermissionFlagsBits, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { infoMessage, unknowenError } = require("./../../../templates/embeds");
const { config } = require("./../../../configurator")
const Tickets = require("./../../../schema/tickets");
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
  
	callback: async (client, interaction) => {
	  	try {
			const discordUserId = interaction.options.get("discord-user").value
			const channelId = interaction.channel.id;
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
				let allow = false
				switch (ticket[0].type) {
					case "development":
						config.DevelopmentHelpers.forEach(roleId => {
							if (interaction.member.roles.cache.has(roleId)) {
								allow = true
							}
						})
						break;
					case "general_support":
						config.GeneralSupportHelpers.forEach(roleId => {
							if (interaction.member.roles.cache.has(roleId)) {
								allow = true
							}
						})
						break;
					case "moderation":
						config.ModerationHelpers.forEach(roleId => {
							if (interaction.member.roles.cache.has(roleId)) {
								allow = true
							}
						})	
						break;
					case "public_relations":
						config.PublicRelationsHelpers.forEach(roleId => {
							if (interaction.member.roles.cache.has(roleId)) {
								allow = true
							}
						})
						break;
				}

				if (allow) {
					if (!ticket[0].participants.includes(discordUserId)) {
						ticket[0].participants.push(discordUserId);
						await ticket[0].save();

						await interaction.channel.permissionOverwrites.edit(discordUserId, {
							ViewChannel: true,
						});

						interaction.reply({
							embeds: [infoMessage(`Added <@${discordUserId}> to the ticket!`)],
							ephemeral: false,
						});

						const TicketChannel = client.channels.cache.get(ticket[0].channelId)
						const TicketChannelNameString = "`#" + TicketChannel.name + "`"
						const Owner = await client.users.fetch(ticket[0].userId)
						const RemovedUser = await client.users.fetch(discordUserId)
						const TicketAddedUserString = "`@" + RemovedUser.username + "`"
						const TicketOwnerUserString = "`@" + Owner.username + "`"
						const LogEmbed = new EmbedBuilder()
							.setAuthor({ name: `Ticket: ${TicketChannel.name}`})
							.setTitle("Ticket participant added")
							.setDescription(`<@${discordUserId}> ${TicketAddedUserString} (${discordUserId}) has been added to a ticket.\n\n**Owner:** <@${ticket[0].userId}> ${TicketOwnerUserString} (${ticket[0].userId})\n**Added by:** <@${interaction.user.id}> (${interaction.user.id})\n**Channel:** ${TicketChannelNameString} (${TicketChannel.id})`)
							.setTimestamp()
							.setColor("#54e858")
							.setFooter({ text: "SpeedKarting Systems", iconURL: botAvatar })    

						const logChannel = client.channels.cache.get(config.TicketLogChannel)
						await logChannel.send({
							embeds: [LogEmbed],
							ephemeral: false
                })
					} else {
						interaction.reply({
							embeds: [infoMessage("The user is already a participant in this ticket.")],
							ephemeral: true,
						});
					}
				} else {
					interaction.reply({
						embeds: [infoMessage("You are not allowed to use this command!")],
						ephemeral: true,
					});
				}
			}
		} catch (err) {		
			log(`\x1b[31m[Error] \x1b[32mAn error occurred:\n\x1b[0m${err}`)
			interaction.reply({
				embeds: [unknowenError("/ticket-add-unknowen")],
				ephemeral: true
			});
	  	}
	},
  };
  