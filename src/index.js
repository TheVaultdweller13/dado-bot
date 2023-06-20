import Bot from './core/bot.js';
import Listener from './strategy/listener.js';
import modes from './strategy/modes.js';

const bot = new Bot();
const listenerStrategy = new Listener(modes.DISCORD, bot);

listenerStrategy.login();
