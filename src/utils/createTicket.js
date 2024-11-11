const { EmbedBuilder, ChannelType, PermissionFlagsBits, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { infoMessage, unknowenError } = require("./../templates/embeds");
const { config } = require("./../configurator")
const { botAvatar } = require("./../handlers/clientHandler")
const Tickets = require("./../schema/tickets")
const log = require("./../utils/log");
const generateRandomString = require("./../utils/generateRandomSting")

module.exports = async (interaction, client, supportRoleIds) => {
    try {
        const supportType = interaction.customId;
        const catagory = client.channels.cache.get(config.TicketCatagory);

        let allowed = true
        config.TicketBannedRoles.forEach(roleId => {
            if (interaction.member.roles.cache.has(roleId)) {
                interaction.reply({
                    embeds: [infoMessage("You are not allowed to create tickets!")],
                    ephemeral: true
                });
                allowed = false
            }
        })
        if (!allowed) {
            return
        }

        let shortName = ""
        let DisplayName = ""
        switch (supportType) {
            case "development":
                shortName = "dev"
                DisplayName ="Development"
                break;
            case "general_support":
                shortName = "support"
                DisplayName ="General Support"
                break;
            case "moderation":
                shortName = "mod"
                DisplayName ="Moderation"
                break;
            case "public_relations":
                shortName = "pr"
                DisplayName ="Public Relations"
                break;
            default:
                shortName = "ticket"
                DisplayName ="Unknowen"
        }

        const permissionOverwrites = [
            { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel] }
        ];

        supportRoleIds.forEach(roleId => {
            permissionOverwrites.push({ id: roleId, allow: [PermissionFlagsBits.ViewChannel] });
        });

        const channel = await interaction.guild.channels.create({
            name: `${shortName}-${generateRandomString(6)}`,
            type: ChannelType.GuildText,
            parent: catagory,
            permissionOverwrites
        });

        const newTicket = new Tickets({
            channelId: channel.id,
            guildId: interaction.guild.id,
            userId: interaction.user.id,
            type: supportType,
            participants: [interaction.user.id],
            status: "open"
        });
        await newTicket.save();

        const botAvatar = client.user.displayAvatarURL({
            format: 'png',
            size: 512
        });

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Type: ${DisplayName}`})
            .setTitle("Support will be with you shortly.")
            .setDescription("To close the ticket, press the button below.")
            .setTimestamp()
            .setColor("#f55a42")
            .setFooter({ text: "SpeedKarting Systems", iconURL: botAvatar })
            .addFields(
                { name: "Ticket Owner", value: `**Username:** <@${interaction.user.id}>\n**ID:** ${interaction.user.id}` })
        
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel("Close Ticket")
                .setCustomId("closeTicket"),
        )
        await channel.send({
            embeds: [embed],
            components: [row],
            ephemeral: false
        });

        const ChannelNameString = "`#" + channel.name + "`"
        const TicketOwnerUserString = "`@" + interaction.user.username + "`"
        const LogEmbed = new EmbedBuilder()
            .setAuthor({ name: `Ticket: ${channel.name}`})
            .setTitle("Ticket Opened")
            .setDescription(`**Owner:** <@${interaction.user.id}> ${TicketOwnerUserString} (${interaction.user.id})\n**Channel:** ${ChannelNameString} (${channel.id})\n**Type:** ${DisplayName}`)
            .setTimestamp()
            .setColor("#54e858")
            .setFooter({ text: "SpeedKarting Systems", iconURL: botAvatar })    

        const logChannel = client.channels.cache.get(config.TicketLogChannel)
        await logChannel.send({
            embeds: [LogEmbed],
            ephemeral: false
        })

        interaction.reply({
            embeds: [infoMessage(`Created your ticket. Please go to <#${channel.id}> and state your problem.`, "#54e858")],
            ephemeral: true
        });

    } catch (err) {
        log(`\x1b[31m[Error] \x1b[32mAn error occurred while creating ticket:\n\x1b[0m${err}`)
        interaction.reply({
            embeds: [unknowenError("createTicket-unknowen")],
            ephemeral: true
        });
    }
};
