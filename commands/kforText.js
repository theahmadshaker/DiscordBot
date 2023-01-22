const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kfor_text")
    .setDescription("Byokfor 3a sot wate (text)"),
  async execute(interaction) {
    return interaction.reply("3an rabak");
  },
};
