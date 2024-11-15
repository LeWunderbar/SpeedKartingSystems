const { PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { infoMessage, unknowenError } = require("./../../../templates/embeds");
const { config } = require("./../../../configurator");
const schema = require("./../../../schema/verifying");
const log = require("./../../../utils/log");
const generateRandomString = require("./../../../utils/generateRandomSting")


module.exports = {
    buttonId: 'verifyBtn',
    callback: async (client, interaction) => {
        try {
            const user = interaction.user.id;
            const botAvatar = client.user.displayAvatarURL({
                format: 'png',
                size: 512
            });

            await interaction.deferReply({ ephemeral: true });
            const code = generateRandomString(10);

            const data = await schema.findOneAndUpdate(
                { discordID: user },
                { $set: { statecode: code }, $setOnInsert: { robloxID: null, verified: false } },
                { new: true, upsert: true }
            );

            const embed = new EmbedBuilder()
                .setTitle('Generated verification Link')
                .setDescription(`Your verification link: [Click Here](https://authorize.roblox.com/?client_id=${config.OAUTH_CLIENT_ID}&response_type=Code&redirect_uri=${config.OAUTH_URL}&scope=openid+profile&state=${code})`)
                .setColor('#f55a42')
                .setTimestamp()
                .setFooter({ text: "SpeedKarting Systems", iconURL: botAvatar });

            await interaction.editReply({
                ephemeral: true,
                embeds: [embed],
            });
        } catch (err) {
            log(`\x1b[31m[Error] \x1b[32mAn error occurred while pressing a button:\n\x1b[0m${err}`);
            interaction.reply({
                embeds: [unknowenError("button-verifyBtn-unknowen")],
                ephemeral: true
            });
        }
    },
};