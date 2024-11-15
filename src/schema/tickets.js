const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  channelId: String,
  guildId: String,
  userId: String,
  type: String,
  status: { type: String, default: 'open' },
  participants: [String],  // Array of user IDs
});

module.exports = mongoose.model('ticket', ticketSchema, "tickets");