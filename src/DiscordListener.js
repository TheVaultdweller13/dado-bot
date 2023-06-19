import { EmbedBuilder, TextChannel } from 'discord.js';
import text from './text.js';

const MENTION_REGEX = /<@(\d+)>/;

export default class DiscordListener {
  constructor(bot, client) {
    this.bot = bot;
    this.client = client;
    this.client.once('ready', this.onReady.bind(this));
    this.client.on('messageCreate', this.onMessageCreate.bind(this));
    this.client.on('guildCreate', this.onGuildCreate.bind(this));
  }

  createEmbed(responseParameters) {
    const { title = null, color, message } = responseParameters;
    return {
      embeds: [new EmbedBuilder().setTitle(title).setColor(color).setDescription(message)],
    };
  }

  async reply(message, answer) {
    await message.channel.send({ ...answer, reply: { messageReference: message, failIfNotExists: false } });
  }

  async handleMention(message) {
    const match = MENTION_REGEX.exec(message.content);
    if (!match) {
      throw new Error('Unable to match mention');
    }
    const [, id] = match;
    if (id !== this.selfId()) {
      return;
    }

    const answer = this.bot.onHelp();
    await this.reply(message, this.createEmbed(answer));
  }

  async handleMessageCreateError(error, channelId) {
    console.warn(error);

    /** @type {TextChannel} */
    // @ts-ignore this would require casting, not available in JS
    const channel = this.client.channels.cache.get(channelId);

    if (!channel) {
      console.warn('Unable to send error message. Channel not found.');
      return;
    }

    await channel?.send(text.GENERIC_ERROR);
  }

  async onReady() {
    try {
      console.log('Ready!');
    } catch (error) {
      console.warn(error);
    }
  }

  async onMessageCreate(message) {
    try {
      if (!message.author.bot && this.bot.isCommandMessage(message.content)) {
        await message.channel.sendTyping();
        const answer = this.bot.executeCommand(message.author.username, message.content);
        await this.reply(message, this.createEmbed(answer));
      } else if (!message.author.bot && MENTION_REGEX.test(message.content)) {
        this.handleMention(message);
      }
    } catch (error) {
      await this.handleMessageCreateError(error, message.channel.id);
    }
  }

  async onGuildCreate(guild) {
    try {
      const welcome = this.bot.welcomeMessage();
      await guild.systemChannel?.send(this.createEmbed(welcome));
    } catch (error) {
      console.error('Error entering new guild: ' + error);
    }
  }

  selfId() {
    const id = this.client.user?.id;
    if (id === null) {
      throw Error('Unable to find self user ID');
    }
    return id;
  }
}
