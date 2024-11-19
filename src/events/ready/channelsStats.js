const { Client, IntentsBitField, EmbedBuilder, Guild } = require("discord.js");
const { config } = require("./../../configurator")
const { client } = require("./../../handlers/clientHandler")
const log = require("../../utils/log")

module.exports = async (client) => {
    function UpdateChannels() {
        fetch(`https://games.roblox.com/v1/games?universeIds=${config.UNIVERSE}`)
            .then(res => res.json())
            .then(json => {
                client.channels.cache.get(config.ChannelVists).setName(`📈︱Visits: ${json.data[0].visits}`)
                .catch(err => {
                    log(`\x1b[31m[Error] \x1b[32mAn error occurred while updating channels (visits):\n\x1b[0m${err}`);
                });
                client.channels.cache.get(config.ChannelPlaying).setName(`🔴︱Playing Now: ${json.data[0].playing}`)
                .catch(err => {
                    log(`\x1b[31m[Error] \x1b[32mAn error occurred while updating channels (playing):\n\x1b[0m${err}`);
                });
                client.channels.cache.get(config.ChannelFavourites).setName(`💕︱Favourites: ${json.data[0].favoritedCount}`)
                .catch(err => {
                    log(`\x1b[31m[Error] \x1b[32mAn error occurred while updating channels (fav):\n\x1b[0m${err}`);
                });
            })
    
            .catch(err => {
                log(`\x1b[31m[Error] \x1b[32mAn error occurred while updating channels (gameInfo):\n\x1b[0m${err}`);
                }
            );
    
        fetch(`https://games.roblox.com/v1/games/votes?universeIds=${config.UNIVERSE}`)
            .then(res => res.json())
            .then(json => {
                client.channels.cache.get(config.ChannelLikes).setName(`👍︱Likes: ${json.data[0].visits}`)
                .catch(err => {
                    log(`\x1b[31m[Error] \x1b[32mAn error occurred while updating channels (likes):\n\x1b[0m${err}`);
                });
            })
    
            .catch(err => {
                log(`\x1b[31m[Error] \x1b[32mAn error occurred while updating channels (votes):\n\x1b[0m${err}`);
                }
            );
    }
    
    setInterval(() => {
        UpdateChannels();
    }, 300 * 1000); // Sec
}