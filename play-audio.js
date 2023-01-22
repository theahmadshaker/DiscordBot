const Commando = require("discord.js-commando");
const path = require("path");

module.exports = class PlayAudioCommando extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "playaudio",
      memberName: "playaudio",
      description: "Plays audio file",
    });
  }

  async run(message) {
    const voice = message.member;

    if (!voice.channelID) {
      message.reply("Tab ma ntek fout 3a voice channel abel ya ayre");
      return;
    }
    voice.channel.join().then((connection) => {
      connection.play(path.join("__dirname", "./audio/delbeni_kofor.ogg"));
    });
  }
};
