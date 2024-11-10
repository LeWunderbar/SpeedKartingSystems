const { config } = require("../../configurator");
const testServer = config.TEST_SERVER;
const devs = config.DEVS;

const getLocalCommands = require('../../utils/getLocalCommands');
const log = require("../../utils/log");

module.exports = async (client, interaction) => {
  // Handle commands and other types of interactions
  try {
    if (interaction.isChatInputCommand()) {
      const localCommands = getLocalCommands();

      const commandObject = localCommands.find(
        (cmd) => cmd.name === interaction.commandName
      );

      if (!commandObject) return;

      // Developer-only command check
      if (commandObject.devOnly) {
        if (!devs.includes(interaction.member.id)) {
          interaction.reply({
            content: 'Only developers are allowed to run this command.',
            ephemeral: true,
          });
          return;
        }
      }

      // Test server command check
      if (commandObject.testOnly) {
        if (!(interaction.guild.id === testServer)) {
          interaction.reply({
            content: 'This command cannot be ran here.',
            ephemeral: true,
          });
          return;
        }
      }

      // Permissions checks for user and bot
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

    } else if (interaction.isButton()) {
      const buttonHandlers = require('../../utils/buttonHandlers');
      const handler = buttonHandlers[interaction.customId];

      if (handler) {
        await handler(client, interaction);
      } else {
        interaction.reply({
          content: 'This button has no handler.',
          ephemeral: true,
        });
      }

    } else if (interaction.isSelectMenu()) {
      const menuHandlers = require('../../utils/menuHandlers');
      const handler = menuHandlers[interaction.customId];

      if (handler) {
        await handler(client, interaction);
      } else {
        interaction.reply({
          content: 'This select menu has no handler.',
          ephemeral: true,
        });
      }
    }
  } catch (error) {
    log(`There was an error processing this interaction: \n\n ${error}`);
  }
};
