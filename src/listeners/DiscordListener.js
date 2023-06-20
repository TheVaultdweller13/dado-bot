import { Client, EmbedBuilder, GatewayIntentBits, TextChannel } from 'discord.js';
import text from '../core/common/text.js';
import config from '../../config.json' assert { type: 'json' };
import regex from './discord/regex.js';

export default class DiscordListener {
  constructor(bot) {
    this.bot = bot;
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
      ],
    });
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
    const match = regex.MENTION.exec(message.content);
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
      if (message.author.bot) {
        return;
      }
      if (this.bot.isCommandMessage(message.content)) {
        await message.channel.sendTyping();
        const answer = this.bot.executeCommand(message.author.username, message.content);
        await this.reply(message, this.createEmbed(answer));
      } else if (regex.MENTION.test(message.content)) {
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

  login() {
    this.client.login(config.token);
  }
}
