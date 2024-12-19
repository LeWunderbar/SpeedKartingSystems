const { Client, IntentsBitField, EmbedBuilder, Guild } = require("discord.js");
const { config } = require("./../../configurator");
const { client } = require("./../../handlers/clientHandler");
const log = require("../../utils/log");

module.exports = async (client) => {
    async function UpdateChannels() {
        try {
            const guild = await client.guilds.fetch(config.GUILD_ID);

            const gameInfo = await fetch(`https://games.roblox.com/v1/games?universeIds=${config.UNIVERSE}`);
            const gameData = await gameInfo.json();

            // Update Visits
            client.channels.cache.get(config.ChannelVists).setName(`📈︱Visits: ${gameData.data[0].visits}`)
                .catch(err => log(`\x1b[31m[Error] \x1b[32mAn error occurred while updating channels (visits):\n\x1b[0m${err}`));

            // Update Playing
            client.channels.cache.get(config.ChannelPlaying).setName(`🔴︱Playing Now: ${gameData.data[0].playing}`)
                .catch(err => log(`\x1b[31m[Error] \x1b[32mAn error occurred while updating channels (playing):\n\x1b[0m${err}`));

            // Update Favourites
            client.channels.cache.get(config.ChannelFavourites).setName(`💕︱Favourites: ${gameData.data[0].favoritedCount}`)
                .catch(err => log(`\x1b[31m[Error] \x1b[32mAn error occurred while updating channels (fav):\n\x1b[0m${err}`));

            // Update Likes
            const voteInfo = await fetch(`https://games.roblox.com/v1/games/votes?universeIds=${config.UNIVERSE}`);
            const voteData = await voteInfo.json();
            client.channels.cache.get(config.ChannelLikes).setName(`👍︱Likes: ${voteData.data[0].upVotes}`)
                .catch(err => log(`\x1b[31m[Error] \x1b[32mAn error occurred while updating channels (likes):\n\x1b[0m${err}`));

            // Updating Boosts
            const boostCount = guild.premiumSubscriptionCount
            client.channels.cache.get(config.ChannelBoosts).setName(`🚀︱Boosts: ${boostCount}`)
                .catch(err => log(`\x1b[31m[Error] \x1b[32mAn error occurred while updating channels (likes):\n\x1b[0m${err}`));

        } catch (err) {
            log(`\x1b[31m[Error] \x1b[32mAn error occurred while updating channels:\n\x1b[0m${err}`);
        }
    }

    await UpdateChannels();
    setInterval(async () => {
        await UpdateChannels();
    }, 300 * 1000); // 5 minutes
};
