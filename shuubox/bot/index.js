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

// --- RECOMMENDED CHANGE: clientReady event ---
// When the bot logs in (Replaces 'ready' to avoid deprecation warning)
client.on('clientReady', () => {
  console.log(`✅ Shuubot is online and logged in as ${client.user.tag}!`);
});

// When someone uses a command
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'recommend') {
    
    // --- STEP 1: DEFER REPLY IMMEDIATELY ---
    // This acknowledges the command within 3 seconds, preventing the 'Unknown Interaction' error.
    await interaction.deferReply({ ephemeral: false });

    const recommendingUser = interaction.user;
    const targetUser = interaction.options.getUser('friend');
    const mediaName = interaction.options.getString('media');

    // --- Safety Checks ---
    if (targetUser.bot) {
      // Must use .editReply because we already deferred
      return interaction.editReply({ content: "You can't recommend media to a bot!", ephemeral: true });
    }
    if (targetUser.id === recommendingUser.id) {
      return interaction.editReply({ content: "You can't recommend media to yourself!", ephemeral: true });
    }

    try {
      // 1. Call your API
      const apiResponse = await fetch(
        `http://localhost:3000/api/check-friendship?userA_id=${recommendingUser.id}&userB_id=${targetUser.id}`,
        {
          headers: { 'X-Bot-Secret': process.env.BOT_SECRET_KEY }
        }
      );
      
      // 2. Check for non-200 errors (e.g., 401 Unauthorized, 500 Internal Server Error)
      if (!apiResponse.ok) {
          const errorBody = await apiResponse.text();
          console.error(`API Error: ${apiResponse.status} - ${errorBody}`);
          return interaction.editReply({
             content: `[DEBUG ERROR] API failed with status ${apiResponse.status}. Check your Next.js terminal!`,
             ephemeral: true
          });
      }

      // 3. Parse the JSON response
      const { status } = await apiResponse.json(); 

      // 4. Use a switch to handle every case
      switch (status) {
        
        case 'FRIENDS':
          // --- SUCCESS LOGIC ---
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

          // Use editReply to send the final public message
          await interaction.editReply({
            content: `<@${targetUser.id}>, check this out!`,
            embeds: [embed],
            components: [row]
          });
          break;

        // --- FAILURE CASES (All must use editReply with ephemeral: true) ---

        case 'NOT_FRIENDS':
          await interaction.editReply({
            content: `You can only send recommendations to your Shuubox friends. Add <@${targetUser.id}> on the app first!`,
            ephemeral: true 
          });
          break;

        case 'USER_A_NOT_FOUND':
          await interaction.editReply({
            content: `You need to sign up for a Shuubox account before you can recommend media!`,
            ephemeral: true
          });
          break;

        case 'USER_B_NOT_FOUND':
          await interaction.editReply({
            content: `<@${targetUser.id}> doesn't have a Shuubox account yet. Tell them to sign up so you can send recommendations!`,
            ephemeral: true
          });
          break;
          
        case 'BOTH_NOT_FOUND':
          await interaction.editReply({
            content: `This function can't be performed because neither you nor <@${targetUser.id}> have a Shuubox account. You both need to sign up first!`,
            ephemeral: true
          });
          break;

        default:
          await interaction.editReply({
            content: `Oops! Something went wrong. The API returned an unknown status: ${status}.`,
            ephemeral: true
          });
      }

    } catch (error) {
      // This catches JSON parse errors or other connection failures
      console.error("Critical Bot Error during API processing:", error); 
      await interaction.editReply({
        content: 'Oops! An internal bot error occurred after receiving the API response. Check console for details.',
        ephemeral: true
      });
    }
  }
});

// Log the bot in
client.login(process.env.DISCORD_BOT_TOKEN);