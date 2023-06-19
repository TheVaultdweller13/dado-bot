import { Channel, Client, EmbedBuilder, GatewayIntentBits, Guild, Message, TextChannel } from 'discord.js';
import config from '../config.json';
import Bot from './bot';
import text from './text';

const token = config.token;
const id = config.bot_id;
const bot = new Bot(id);

const createEmbed = (params: { title: string | null; message: string; color: number }) => {
  const { title, color, message } = params;
  return {
    embeds: [new EmbedBuilder().setTitle(title).setColor(color).setDescription(message)],
  };
};

const reply = async (message: Message, answer: { embeds: EmbedBuilder[] }) => {
  await message.channel.send({ ...answer, reply: { messageReference: message, failIfNotExists: false } });
};

const handleMessageCreateError = async (error: unknown, channelId: string) => {
  console.warn(error);
  const channel = client.channels.cache.get(channelId) as TextChannel;

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

const onMessageCreate = async (message: Message) => {
  try {
    if (!message.author.bot && bot.isCommandMessage(message.content)) {
      await message.channel.sendTyping();
      const answer = bot.executeCommand(message.author.username, message.content);
      await reply(message, createEmbed(answer));
    }
  } catch (error) {
    handleMessageCreateError(error, message.channel.id);
  }
};

const onGuildCreate = async (guild: Guild) => {
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
