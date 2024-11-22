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
        const botMember = await guild.members.fetch(client.user.id)

        if (member.id == guild.ownerId) {
            return "OwnerErr"
        } 

        if (development) {
            return 0
        }

        if (member.roles.highest.position >= botMember.roles.highest.position) {
            return "postionErr"
        }

        member.setNickname(username)
        // Roles based on group rank

        // RP
        const RP_RankName = await getUserGroupRank(RobloxUserId, "16117955")
        console.log(RP_RankName) //DEBUG
        if (RP_RankName != null) {
            if (ranklistGroup[RP_RankName]) {
                try {
                    const roleRP = guild.roles.cache.find(r => r.id == ranklistGroup[RP_RankName])
                    console.log(roleRP) //DEBUG
                    if (roleRP) {
                        member.roles.add(roleRP.id)
                        console.log("Added") //DEBUG
                    }
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
                    const roleQA = guild.roles.cache.find(r => r.id == ranklistGroup[QA_RankName])
                    if (roleQA) {
                        member.roles.add(roleQA.id)
                    }
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
                    const roleMod = guild.roles.cache.find(r => r.id == ranklistGroup[Mod_RankName])
                    if (roleMod) {
                        member.roles.add(roleMod.id)
                    }
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