import { Client, EmbedBuilder, GatewayIntentBits, TextChannel } from 'discord.js';
import config from '../config.json' assert { type: 'json' };
import Bot from './bot.js';
import text from './text.js';

const token = config.token;
const bot = new Bot();

const createEmbed = (responseParameters) => {
  const { title = null, color, message } = responseParameters;
  return {
    embeds: [new EmbedBuilder().setTitle(title).setColor(color).setDescription(message)],
  };
};

const reply = async (message, answer) => {
  await message.channel.send({ ...answer, reply: { messageReference: message, failIfNotExists: false } });
};

const handleMessageCreateError = async (error, channelId) => {
  console.warn(error);

  /** @type {TextChannel} */
  // @ts-ignore this would require casting, not available in JS
  const channel = client.channels.cache.get(channelId);

  if (!channel) {
    console.warn('Unable to send error message. Channel not found.');
    return;
  }

  await channel?.send(text.GENERIC_ERROR);
};

const onReady = async () => {
  try {
    console.log('Ready!');
  } catch (error) {
    console.warn(error);
  }
};

const onMessageCreate = async (message) => {
  try {
    if (!message.author.bot && bot.isCommandMessage(message.content)) {
      await message.channel.sendTyping();
      const answer = bot.executeCommand(message.author.username, message.content);
      if (!answer) {
        return;
      }
      await reply(message, createEmbed(answer));
    }
  } catch (error) {
    handleMessageCreateError(error, message.channel.id);
  }
};

const onGuildCreate = async (guild) => {
  try {
    const welcome = bot.welcomeMessage();
    await guild.systemChannel?.send(createEmbed(welcome));
  } catch (error) {
    console.error('Error entering new guild: ' + error);
  }
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', onReady);
client.on('messageCreate', onMessageCreate);
client.on('guildCreate', onGuildCreate);
client.login(token);
