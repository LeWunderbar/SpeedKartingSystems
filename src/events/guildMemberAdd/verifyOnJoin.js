const { infoMessage, unknowenError } = require("./../../../templates/embeds");
const { update } = require("./../../utils/updateDiscordUser")
const { config } = require("./../../configurator");
const schema = require("./../../schema/verifying");
const log = require("./../../utils/log");

module.exports = async (member) => {
    try {
        const data = await schema.find({ discordID: member.user.id }).exec();
        if (member.guild.id == config.GUILD_ID) {
            if (!data.length === 0) {
                if (data[0].verified) {
                    await update()
                }
            }
        }
    } catch (err) {
        log(`\x1b[31m[Error] \x1b[32mAn error occurred:\n\x1b[0m${err}`)
        interaction.reply({
            embeds: [unknowenError("verifyOnJoin-unknowen")],
            ephemeral: true
        });
    }
}