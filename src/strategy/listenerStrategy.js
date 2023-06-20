import DiscordListener from '../listeners/DiscordListener.js';
import ReadlineListener from '../listeners/ReadlineListener.js';
import modes from './modes.js';

export default class ListenerStrategy {
  constructor(mode, bot) {
    switch (mode) {
      case modes.DISCORD:
        this.listener = new DiscordListener(bot);
        break;
      case modes.CONSOLE:
        this.listener = new ReadlineListener(bot);
        break;
      default:
        throw new Error(`Invalid listener type: ${mode}`);
    }
  }

  login() {
    this.listener.login();
  }
}
