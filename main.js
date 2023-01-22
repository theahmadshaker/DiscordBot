const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
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

// Sot el delbeni 3m yokfor

var isReady = true;

client.on("message", (message) => {
  console.log(message);
  if (
    (isReady && message.content === "Kfor mn albak") ||
    (isReady && message.content === "kfor mn albak")
  ) {
    console.log("I got the message");
    isReady = false;
    var voiceChannel = message.member.voiceChannel;
    voiceChannel
      .join()
      .then((connection) => {
        const dispatcher = connection.playFile("./audio/delbeni_kofor.ogg");
        dispatcher.on("end", (end) => {
          voiceChannel.leave();
        });
      })
      .catch((err) => console.log(err));
    isReady = true;
  }
});

client.login(token);
