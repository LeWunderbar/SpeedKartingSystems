const {config} = require("../../configurator")
const testServer = config.TEST_SERVER
const devs = config.DEVS

const getLocalCommands = require('../../utils/getLocalCommands');
const log = require("../../utils/log")

module.exports = async (interaction, client) => {
    if (interaction.isCommand() || interaction.isContextMenu()) slashInteraction(interaction, client)
	else if (interaction.isButton()) buttonInteraction(interaction, client)
	else if (interaction.isSelectMenu()) selectMenuInteraction(interaction, client)
}

async function slashInteraction(interaction, client) { 
    const localCommands = getLocalCommands();
    console.log(localCommands)
  
    try {
      const commandObject = localCommands.find(
        (cmd) => cmd.name === interaction.commandName
      );
  
      if (!commandObject) return;
  
      if (commandObject.devOnly) {
        if (!devs.includes(interaction.member.id)) {
          interaction.reply({
            content: 'Only developers are allowed to run this command.',
            ephemeral: true,
          });
          return;
        }
      }
  
      if (commandObject.testOnly) {
        if (!(interaction.guild.id === testServer)) {
          interaction.reply({
            content: 'This command cannot be ran here.',
            ephemeral: true,
          });
          return;
        }
      }
  
      if (commandObject.permissionsRequired?.length) {
        for (const permission of commandObject.permissionsRequired) {
          if (!interaction.member.permissions.has(permission)) {
            interaction.reply({
              content: 'Not enough permissions.',
              ephemeral: true,
            });
            return;
          }
        }
      }
  
      if (commandObject.botPermissions?.length) {
        for (const permission of commandObject.botPermissions) {
          const bot = interaction.guild.members.me;
  
          if (!bot.permissions.has(permission)) {
            interaction.reply({
              content: "I don't have enough permissions.",
              ephemeral: true,
            });
            return;
          }
        }
      }
  
      await commandObject.callback(client, interaction);
    } catch (error) {
      log(`\x1b[31m[Error] \x1b[32mAn error occurred in handleCommands.js:\n\x1b[0m${error}`)
    }
  };