// bot/deploy-commands.js
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import 'dotenv/config'; // Loads .env variables

// --- Define your commands here ---
const commands = [
  new SlashCommandBuilder()
    .setName('recommend')
    .setDescription('Recommend media to a Shuubox friend.')
    .addUserOption(option =>
      option
        .setName('friend')
        .setDescription('The friend you want to recommend to')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('media')
        .setDescription('The movie, game, or book name')
        .setRequired(true))
  // Add other commands here in the future
].map(command => command.toJSON());

// --- Get your .env variables ---
const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // This is your test server's ID

if (!token || !clientId || !guildId) {
  console.error('Error: Missing DISCORD_BOT_TOKEN, CLIENT_ID, or GUILD_ID in your bot/.env file.');
  process.exit(1); // Stop the script
}

// --- The registration logic ---
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // The 'put' method fully refreshes all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log(`✅ Successfully reloaded ${data.length} (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();