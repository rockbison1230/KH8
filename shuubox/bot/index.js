// bot/index.js
import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';
import fetch from 'node-fetch';
import 'dotenv/config'; // Loads .env variables

// Create the bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the bot logs in
client.on('ready', () => {
  console.log(`✅ Shuubot is online and logged in as ${client.user.tag}!`);
});

// When someone uses a command
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'recommend') {
    const recommendingUser = interaction.user;
    const targetUser = interaction.options.getUser('friend');
    const mediaName = interaction.options.getString('media');

    // --- Safety Checks ---
    if (targetUser.bot) {
      return interaction.reply({ content: "You can't recommend media to a bot!", ephemeral: true });
    }
    if (targetUser.id === recommendingUser.id) {
      return interaction.reply({ content: "You can't recommend media to yourself!", ephemeral: true });
    }

    try {
      // 1. Call your Next.js API
      const apiResponse = await fetch(
        // IMPORTANT: Use your localhost:3000 URL since you're testing locally
        `http://localhost:3000/api/check-friendship?userA_id=${recommendingUser.id}&userB_id=${targetUser.id}`,
        {
          headers: {
            'X-Bot-Secret': process.env.BOT_SECRET_KEY
          }
        }
      );
      
      const { status } = await apiResponse.json();

      // 3. Use a switch to handle every case
      switch (status) {
        
        case 'FRIENDS':
          const addUrl = `http://localhost:3000/dashboard/add?title=${encodeURIComponent(mediaName)}`;
          const row = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setLabel('Add to My List')
                .setURL(addUrl)
                .setStyle(ButtonStyle.Link)
            );

          const embed = new EmbedBuilder()
            .setColor('#00A3A3')
            .setTitle('📫 You\'ve got a recommendation!')
            .setDescription(`Hey <@${targetUser.id}>, your friend <@${recommendingUser.id}> recommends you check out:`)
            .addFields({ name: 'Media', value: `**${mediaName}**` })
            .setThumbnail(recommendingUser.displayAvatarURL());

          await interaction.reply({
            content: `<@${targetUser.id}>, check this out!`,
            embeds: [embed],
            components: [row]
          });
          break;

        case 'NOT_FRIENDS':
          // ... (all the other cases: NOT_FRIENDS, USER_A_NOT_FOUND, etc.)
          await interaction.reply({
            content: `You can only send recommendations to your Shuubox friends. Add <@${targetUser.id}> on the app first!`,
            ephemeral: true 
          });
          break;
        
        // ... add the other 'case' blocks here ...

        default:
          await interaction.reply({
            content: 'Oops! Something went wrong. Please try again later.',
            ephemeral: true
          });
      }

    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'Oops! An error occurred while contacting the Shuubox server.',
        ephemeral: true
      });
    }
  }
});

// Log the bot in
client.login(process.env.DISCORD_BOT_TOKEN);