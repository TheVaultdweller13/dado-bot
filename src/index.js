import Bot from './core/bot.js';
import ListenerStrategy from './strategy/listenerStrategy.js';
import modes from './strategy/modes.js';

const bot = new Bot();
const listenerStrategy = new ListenerStrategy(modes.CONSOLE, bot);

listenerStrategy.login();
