const { infoMessage, unknowenError } = require("./../../templates/embeds");
const { update } = require("./../../utils/updateDiscordUser")
const { config } = require("./../../configurator");
const schema = require("./../../schema/verifying");
const log = require("./../../utils/log");

module.exports = async (member) => {
    //
    //try {
    //  const data = await schema.find({ discordID: member.user.id }).exec();
    //    if (member.guild.id == config.GUILD_ID) {
    //        if (!data.length === 0) {
    //            if (data[0].verified) {
    //                await update(data[0].robloxID, data[0].discordID)
    //            }
    //       }
    //    }
    //} catch (err) {
    //    log(`\x1b[31m[Error] \x1b[32mAn error occurred while trying to verify user on join:\n\x1b[0m${err}`)
    //}
}