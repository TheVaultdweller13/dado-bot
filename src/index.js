import readline from 'readline';
import { Client, GatewayIntentBits } from 'discord.js';

import config from '../config.json' assert { type: 'json' };
import Bot from './Bot.js';
import DiscordListener from './DiscordListener.js';
import ReadlineListener from './ReadlineListener.js';

const bot = new Bot();

if (config.mode.includes('discord')) {
  const discordClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
    ],
  });

  const discordListener = new DiscordListener(bot, discordClient);

  discordClient.login(config.token);
}

if (config.mode.includes('console')) {
  const consoleClient = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
  });

  const consoleListener = new ReadlineListener(bot, consoleClient);

  console.log('Console mode enabled, use Ctrl+D to finish');
  consoleClient.prompt();
}
