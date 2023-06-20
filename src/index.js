import Bot from './core/bot.js';
import App from './app/app.js';
import modes from './app/modes.js';

const bot = new Bot();
const discord = new App(modes.DISCORD, bot);

discord.start();
