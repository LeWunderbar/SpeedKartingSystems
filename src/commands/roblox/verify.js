const { PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { infoMessage, unknowenError } = require("./../../templates/embeds");
const { config } = require("../../configurator");
const schema = require("../../schema/verifying");
const log = require("../../utils/log");

function makeId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

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
            const data = await schema.find({ discordID: user }).exec();
            let embed;

            if (data.length === 0) {
                const newSchema = new schema({
                    robloxID: null,
                    discordID: user,
                    verified: false,
                    statecode: null,
                });
                await newSchema.save();

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

            const code = makeId(10);
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