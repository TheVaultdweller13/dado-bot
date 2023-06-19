import config from '../config.json' assert { type: 'json' };
import Bot from './Bot.js';
import { Client, GatewayIntentBits } from 'discord.js';
import DiscordListener from './DiscordListener.js';

const bot = new Bot();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
});

const listener = new DiscordListener(bot, client);

client.login(config.token);
