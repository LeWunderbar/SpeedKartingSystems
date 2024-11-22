const { PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { infoMessage, unknowenError } = require("./../../../templates/embeds");
const { config } = require("./../../../configurator");
const schema = require("./../../../schema/verifying");
const log = require("./../../../utils/log");
const generateRandomString = require("./../../../utils/generateRandomSting")

module.exports = {
    name: 'verify',
    description: 'Verify your Roblox account',
    permissionsRequired: PermissionFlagsBits.ManageNicknames,

    callback: async (client, interaction) => {
        try {
            const user = interaction.user.id;
            const botAvatar = client.user.displayAvatarURL({
                format: 'png',
                size: 512
            });

            await interaction.deferReply({ephemeral: true});

            const data = await schema.findOneAndUpdate(
                { discordID: user },
                { 
                    $set: { statecode: code }, 
                    $setOnInsert: { robloxID: null, verified: false, createdAt: new Date() }
                },
                { new: true, upsert: true }
            );
            let embed;

            if (data.createdAt && (new Date(data.createdAt)).getTime() === (new Date()).getTime()) {
                embed = new EmbedBuilder()
                    .setTitle('Verification')
                    .setDescription('Click the button below to verify your Roblox account!')
                    .setColor('#f55a42')
                    .setTimestamp()
                    .setFooter({ text: "SpeedKarting Systems", iconURL: botAvatar });
            } else {
                embed = new EmbedBuilder()
                    .setTitle('Verification')
                    .setDescription('Click the button below to re-verify your Roblox account!')
                    .setColor('#f55a42')
                    .setTimestamp()
                    .setFooter({ text: "SpeedKarting Systems", iconURL: botAvatar });
            }

            const code = generateRandomString(10);
            if (data.length > 0) {
                data[0].statecode = code;
                await data[0].save();
            }

            let button = new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel('Verify')
                .setURL(`https://authorize.roblox.com/?client_id=${config.OAUTH_CLIENT_ID}&response_type=Code&redirect_uri=${config.OAUTH_URL}&scope=openid+profile&state=${code}`);
            const row = new ActionRowBuilder().addComponents(button);

            await interaction.editReply({
                ephemeral: true,
                embeds: [embed],
                components: [row],
            });
        } catch (err) {
            log(`\x1b[31m[Error] \x1b[32mAn error occurred:\n\x1b[0m${err}`)
            interaction.reply({
                embeds: [unknowenError("/verify-unknowen")],
                ephemeral: true
            });
        }
    },
};