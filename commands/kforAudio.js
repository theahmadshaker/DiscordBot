const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kfor_audio")
    .setDescription("Byokfor 3a sot 3ale (audio)"),
  async execute(interaction) {
    return interaction.reply("Nope, Jarreb bala le slash");
  },
};
