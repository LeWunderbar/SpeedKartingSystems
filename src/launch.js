//////////////////////////
// Imports of Index.js //
/////////////////////////

const { Client, IntentsBitField } = require('discord.js');
// const mongoose = require("mongoose")

const eventHandler = require('./handlers/eventHandler');
const log = require("./utils/log")

/////////////
// Configs //
/////////////

const development = true;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const config = development
  ? require('./../configDev.json')
  : require('./../config.json');

require('dotenv').config({
  path: development ? '.envDev' : '.env'
});

module.exports = { config, development}

////////////////
// Launch Bot //
////////////////

console.clear();
console.log(`
    ██╗      ██████╗ ██╗   ██╗    ███╗   ███╗██████╗ ██████╗
    ╚██╗     ██╔══██╗╚██╗ ██╔╝    ████╗ ████║╚════██╗╚════██╗
     ╚██╗    ██████╔╝ ╚████╔╝     ██╔████╔██║ █████╔╝ █████╔╝
     ██╔╝    ██╔══██╗  ╚██╔╝      ██║╚██╔╝██║██╔═══╝  ╚═══██╗
    ██╔╝     ██████╔╝   ██║       ██║ ╚═╝ ██║███████╗██████╔╝
    ╚═╝      ╚═════╝    ╚═╝       ╚═╝     ╚═╝╚══════╝╚═════╝                                                
`);

(async () => {
  try {
    // // MongoDB Setup
    // mongoose.set("strictQuery", false)
    // await mongoose.connect(process.env.MONGODB_URI, { keepAlive: true });
    // log("Connected to MongoDB")
    
    // Bot Setup
    eventHandler(client);
    client.login(process.env.TOKEN);
  } catch (error) {
    log(`There was an error! \n \n ${error}`)
  }
})();
