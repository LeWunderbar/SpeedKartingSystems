const { getUserGroupRank, getUsernameFromUserId } = require("./../utils/roblox")
const { client } = require("./../handlers/clientHandler")
const { config, development} = require("./../configurator")

const ranklistGroup = require("./../lists/ranklistGroup.json")
const ranklistGame = require("./../lists/ranklistGame.json")

async function update(RobloxUserId, DiscordUserId) {
    try {

        // Change nickname to Roblox Username
        const guild = client.guilds.cache.get(config.GUILD_ID)
        const username = await getUsernameFromUserId(RobloxUserId)
        const member = await guild.members.fetch(DiscordUserId)
        if (member.id != guild.ownerId) {
            member.setNickname(username)
        }

        if (!development) {
            // Roles based on group rank
            // RP
            const RP_RankName = await getUserGroupRank(RobloxUserId, "16117955")
            if (RP_RankName != null) {
                member.roles.add(ranklistGroup.Static_PR_Team)

                if (ranklistGroup[RP_RankName]) {
                    try {
                        member.roles.add(ranklistGroup[RP_RankName])
                    } catch (err) {
                        console.log(err)
                    }
                }
            }

            // QA
            const QA_RankName = await getUserGroupRank(RobloxUserId, "35177988")
            if (QA_RankName != null) {
                member.roles.add(ranklistGroup.Static_QA_Team)

                if (ranklistGroup[QA_RankName]) {
                    try {
                        member.roles.add(ranklistGroup[QA_RankName])
                    } catch (err) {
                        console.log(err)
                    }
                }
            }

            // Mod
            const Mod_RankName = await getUserGroupRank(RobloxUserId, "35177986")
            if (Mod_RankName != null) {
                member.roles.add(ranklistGroup.Static_Mod_Team)

                if (ranklistGroup[Mod_RankName]) {
                    try {
                        member.roles.add(ranklistGroup[Mod_RankName])
                    } catch (err) {
                        console.log(err)
                    }
                }
            }

            // Ranks based on in-game rank:
        }
    } catch (err) {
        log(`\x1b[31m[Error] \x1b[32m"An error occurred in UpdateDiscordUser.js:"\n\x1b[0m${err}`)
    }
}

module.exports = { update }