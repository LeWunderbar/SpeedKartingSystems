const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");
const { config } = require("../../configurator");
const log = require("../../utils/log");

module.exports = async (oldGuild, newGuild) => {
	try {
		if (oldGuild.premiumSubscriptionCount == newGuild.premiumSubscriptionCount) {
            return
        }

        const channel = guild.channels.cache.get(config.ChannelBoosts);
        const boostCount = guild.premiumSubscriptionCount;

        await channel.setName(`🚀︱Boosts: ${boostCount}`);

	} catch (error) {
		log(`\x1b[31m[Error] \x1b[32mAn error occurred while updating boost count:\n\x1b[0m${error}`);
	}
};
