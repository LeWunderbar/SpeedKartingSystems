const { EmbedBuilder, PermissionFlagsBits,  ApplicationCommandOptionType } = require("discord.js")
const schema = require("./../../schema/schema");
const { update } = require("./../../utils/updateDiscordUser")
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
            await interaction.deferReply({ephemeral: true});
            const discordUserId = interaction.options.get("discord-user").value
            const data = await schema.find({ discordID: discordUserId }).exec();
            if (data.length === 0) {
                embed = new EmbedBuilder()
                    .setTitle('Updating User Roles')
                    .setDescription('The user you select is not verifyed! Cannot update user!')
                    .setColor('#f55a42')
                    .setTimestamp();
                interaction.editReply({embeds: [embed], ephemeral: true})
            } else {
                const robloxUserId = data[0].robloxID
                await update(robloxUserId, discordUserId)
                embed = new EmbedBuilder()
                    .setTitle('Updating User Roles')
                    .setDescription('Successfuly updated user roles!')
                    .setColor('#48f542')
                    .setTimestamp();
                interaction.editReply({embeds: [embed], ephemeral: true})
            }
        } catch (err) {
            log(err)
            embed = new EmbedBuilder()
                    .setTitle('Updating User Roles')
                    .setDescription('There was an error! it has been logged. Please notify an bot devleoper!')
                    .setColor('#f55a42')
                    .setTimestamp();
            interaction.editReply({embeds: [embed], ephemeral: true})
        }
  },
}