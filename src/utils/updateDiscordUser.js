const { getUserGroupRank, getUsernameFromUserId } = require("./../utils/roblox")
const { client } = require("./../handlers/clientHandler")
const { config, development} = require("./../configurator")
const log = require("./../utils/log")

const ranklistGroup = require("./../lists/ranklistGroup.json")
const ranklistGame = require("./../lists/ranklistGame.json")

async function update(RobloxUserId, DiscordUserId) {
    try {
        // Change nickname to Roblox Username
        const guild = client.guilds.cache.get(config.GUILD_ID)
        const username = await getUsernameFromUserId(RobloxUserId)
        const member = await guild.members.fetch(DiscordUserId)

        if (member.id == guild.ownerId) {
            return "OwnerErr"
        } 

        if (development) {
            return 0
        }

        if (member.roles.highest.position >= client.roles.highest.position) {
            console.log("postionErr")
            return "postionErr"
        }

        member.setNickname(username)
        // Roles based on group rank
        // RP
        const RP_RankName = await getUserGroupRank(RobloxUserId, "16117955")
        if (RP_RankName != null) {
            if (ranklistGroup[RP_RankName]) {
                try {
                    member.roles.add(ranklistGroup[RP_RankName])
                } catch (err) {
                    log(`\x1b[31m[Error] \x1b[32m"An error occurred in UpdateDiscordUser.js:"\n\x1b[0m${err}`)
                }
            }
        }
    
        // QA
        const QA_RankName = await getUserGroupRank(RobloxUserId, "35177988")
        if (QA_RankName != null) {
            if (ranklistGroup[QA_RankName]) {
                try {
                    member.roles.add(ranklistGroup[QA_RankName])
                } catch (err) {
                    log(`\x1b[31m[Error] \x1b[32m"An error occurred in UpdateDiscordUser.js:"\n\x1b[0m${err}`)
                }
            }
        }
    
        // Mod
        const Mod_RankName = await getUserGroupRank(RobloxUserId, "35177986")
        if (Mod_RankName != null) {
            if (ranklistGroup[Mod_RankName]) {
                try {
                    member.roles.add(ranklistGroup[Mod_RankName])
                } catch (err) {
                    log(`\x1b[31m[Error] \x1b[32m"An error occurred in UpdateDiscordUser.js:"\n\x1b[0m${err}`)
                }
            }
        }

        // Roles based on in-game rank

        return 0

    } catch (err) {
        log(`\x1b[31m[Error] \x1b[32m"An error occurred in UpdateDiscordUser.js:"\n\x1b[0m${err}`)
    }
}

module.exports = { update }