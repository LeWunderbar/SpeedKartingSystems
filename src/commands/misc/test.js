const { getUserGroupRank } = require("./../../utils/roblox")

const { update } = require("./../../utils/updateDiscordUser")

module.exports = {
	name: 'test',
	description: 'testing!',
	// devOnly: Boolean,
	// testOnly: Boolean,
	// options: Object[],
	// deleted: Boolean,
	// permissionsRequired: // EXSAMPLE: [PermissionFlagsBits.Administrator],
	// botPermissions: 
  
	callback: async(client, interaction) => {
	await interaction.deferReply();

	
	interaction.editReply(`Tested`)
  	},
}