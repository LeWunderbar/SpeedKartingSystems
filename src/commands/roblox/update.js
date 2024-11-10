const { EmbedBuilder, PermissionFlagsBits, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { update } = require("./../../utils/updateDiscordUser")
const { infoMessage, unknowenError } = require("./../../templates/embeds");
const schema = require("./../../schema/schema");
const log = require("./../../utils/log")

module.exports = {
    name: 'update',
    description: 'Update Discord roles for user',
    options: [
        {
            name: "discord-user",
            description: "The Discord user to update the roles of",
            required: true,
            type: ApplicationCommandOptionType.User
        }
    ],
  
    callback: async(client, interaction) => {
        try {
            const discordUserId = interaction.options.get("discord-user").value

            await interaction.deferReply({ephemeral: true});

            const data = await schema.find({ discordID: discordUserId }).exec();
            const botAvatar = client.user.displayAvatarURL({
                format: 'png',
                size: 512
            });

            if (data.length === 0) {
                interaction.editReply({
                    embeds: [infoMessage("The user you select is not verifyed! Cannot update user!")],
                    ephemeral: true
                });
            } else {
                const robloxUserId = data[0].robloxID
                await update(robloxUserId, discordUserId)
                embed = new EmbedBuilder()
                    .setTitle('Updated user roles')
                    .setDescription('Successfully updated user roles!')
                    .setColor('#48f542')
                    .setTimestamp()
                    .setFooter({ text: "SpeedKarting Systems", iconURL: botAvatar });
                interaction.editReply({embeds: [embed], ephemeral: true})
            }
        } catch (err) {
            log(`\x1b[31m[Error] \x1b[32mAn error occurred:\n\x1b[0m${err}`)
            interaction.reply({
                embeds: [unknowenError("/update-unknowen")],
                ephemeral: true
            });
        }
  },
}