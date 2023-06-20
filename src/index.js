import Bot from './core/bot.js';
import App from './app/app.js';
import modes from './app/modes.js';

const discord = new App(modes.DISCORD, new Bot());

discord.start();
