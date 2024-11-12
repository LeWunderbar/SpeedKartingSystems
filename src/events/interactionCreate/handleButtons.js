const { config } = require("../../configurator");
const testServer = config.TEST_SERVER;
const devs = config.DEVS;
const log = require("../../utils/log");
const getLocalButtons = require('../../utils/getLocalButtons');

module.exports = async (client, interaction) => {
  if (!interaction.isButton()) return;

  const buttonId = interaction.customId;
  const localButtons = getLocalButtons();

  try {
    const buttonHandler = localButtons.find((cmd) => cmd.buttonId === buttonId);
    if (!buttonHandler) return;

    if (buttonHandler.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        interaction.reply({
          content: 'Only developers are allowed to press this button.',
          ephemeral: true,
        });
        return;
      }
    }

    if (buttonHandler.testOnly) {
      if (!(interaction.guild.id === testServer)) {
        interaction.reply({
          content: 'This button cannot be pressed here.',
          ephemeral: true,
        });
        return;
      }
    }

    if (buttonHandler.permissionsRequired?.length) {
      for (const permission of buttonHandler.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          interaction.reply({
            content: 'Not enough permissions.',
            ephemeral: true,
          });
          return;
        }
      }
    }

    await buttonHandler.callback(client, interaction);
	
  } catch (error) {
    log(`\x1b[31m[Error] \x1b[32mAn error occurred in handleButtons.js:\n\x1b[0m${error}`)
    interaction.reply({
      content: 'An error occurred while handling the button interaction.',
      ephemeral: true,
    });
  }
};