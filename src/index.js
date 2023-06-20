import Bot from './core/bot.js';
import Listener from './strategy/listener.js';
import modes from './strategy/modes.js';

const bot = new Bot();
const listener = new Listener(modes.DISCORD, bot);

listener.login();
