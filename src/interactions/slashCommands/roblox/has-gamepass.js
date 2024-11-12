const { getGamePassThumbnail, checkGamePassOwnership, getGamePassInfo, getUserIdFromUsername, getAvatarThumbnail } = require("./../../../utils/roblox");
const { EmbedBuilder, PermissionFlagsBits, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { infoMessage, unknowenError } = require("./../../../templates/embeds");
const log = require("../../../utils/log");

module.exports = {
	name: 'has-gamepass',
	description: 'Check if a user has a gamepass.',
    options: [
        {
            name: "roblox-username",
            description: "A Roblox username to check",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "gamepass-id",
            description: "The ID of the gamepass",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],

	callback: async (client, interaction) => {
        try {
            const username = interaction.options.get("roblox-username").value;
            const gamepassId = interaction.options.get("gamepass-id").value;
            const userid = await getUserIdFromUsername(username);

            const botAvatar = client.user.displayAvatarURL({
                format: 'png',
                size: 512
            });

            if (!userid) {
                interaction.reply({
                    embeds: [infoMessage("Cannot find UserId for the provided username! Is the username valid?")],
                    ephemeral: true
                });
            } else {
                const gamepassInfo = await getGamePassInfo(gamepassId);
                if (!gamepassInfo) {
                    interaction.reply({
                        embeds: [infoMessage("Cannot find a gamepass with the provided ID! Is the gamepass valid?")],
                        ephemeral: true
                    });
                } else {
                    const hasGamepass = await checkGamePassOwnership(userid, gamepassId);
                    const avatarRaw = await getAvatarThumbnail(userid);
                    const thumbnailRaw = await getGamePassThumbnail(gamepassId, true);
                    const gamepassInfoString = `**Name:** ${gamepassInfo.name}\n**ID:** ${gamepassInfo.id}\n**Price:** ${gamepassInfo.price}\n**Description:** ${gamepassInfo.description}`;

                    if (!hasGamepass) {
                        const embed = new EmbedBuilder()
                            .setAuthor({ name: `${username} (${userid})`, iconURL: avatarRaw[0]?.state === "Completed" ? avatarRaw[0].thumbnailUrl : undefined })
                            .setColor("#f55a42")
                            .setTitle("User dose not own the gamepass.")
                            .setDescription(gamepassInfoString)
                            .setTimestamp()
                            .setFooter({ text: "SpeedKarting Systems", iconURL: botAvatar });
                            if (thumbnailRaw[0]?.state === "Completed") {
                                embed.setThumbnail(thumbnailRaw[0].thumbnailUrl);
                            }
                        const button = new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel("View gamepass")
                            .setURL(`https://www.roblox.com/game-pass/${gamepassId}`);
                        const row = new ActionRowBuilder().addComponents(button);

                        interaction.reply({
                            embeds: [embed],
                            components: [row],
                            ephemeral: false
                        });
                    } else {
                        const embed = new EmbedBuilder()
                            .setAuthor({ name: `${username} (${userid})`, iconURL: avatarRaw[0]?.state === "Completed" ? avatarRaw[0].thumbnailUrl : undefined })
                            .setTitle("User owns the gamepass.")
                            .setColor("#51e640")
                            .setDescription(gamepassInfoString)
                            .setTimestamp()
                            .setFooter({ text: "SpeedKarting Systems", iconURL: botAvatar });
                            if (thumbnailRaw[0]?.state === "Completed") {
                                embed.setThumbnail(thumbnailRaw[0].thumbnailUrl);
                            }

                        const button = new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel("View gamepass")
                            .setURL(`https://www.roblox.com/game-pass/${gamepassId}`);
                        const row = new ActionRowBuilder().addComponents(button);

                        interaction.reply({
                            embeds: [embed],
                            components: [row],
                            ephemeral: false
                        });
                    }
                }
            }
        } catch (err) {
            log(`\x1b[31m[Error] \x1b[32mAn error occurred:\n\x1b[0m${err}`)
            interaction.reply({
                embeds: [unknowenError("/has-gamepass-unknowen")],
                ephemeral: true
            });
        }
    }
};