const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const { token } = require("./config.json");
const { join } = require("node:path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
  console.log("Ready!");
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

var isReady = true;

client.on("messageCreate", (message) => {
  // If user is not in a voice channel return error
  if (!message.member.voice.channel) {
    console.log("No channel detected!");
    return;
  }

  // If the message content is as needed to the following
  if (isReady && message.content === "delbeni kfor") {
    // Defining the resource path and creating the audio player
    const resource = createAudioResource("./audio/delbeni_kofor.mp3");
    const player = createAudioPlayer();

    // If the audio player started playing, log it in the console
    player.on(AudioPlayerStatus.Playing, () => {
      console.log("The audio player has started playing!");
    });
    // If an error occured, log it in the console
    player.on("error", (error) => {
      console.error(`Error: ${error.message} with resource`);
    });

    player.play(resource);

    var voiceChannel = message.member.voice.channel;
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guildId,
      adapterCreator: message.guild.voiceAdapterCreator,
      selfDeaf: false,
    });

    const subscription = connection.subscribe(player);

    if (!subscription) {
      console.log("No subscription");
    }
    if (subscription) {
      // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
      setTimeout(() => subscription.unsubscribe(), 30_000);
    }

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log(
        "The connection has entered the Ready state - ready to play audio!"
      );
    });

    setTimeout(() => {
      player.stop();
      connection.destroy();
    }, 3000);
  }
});

client.login(token);
