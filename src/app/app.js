import DiscordListener from '../listeners/DiscordListener.js';
import ReadlineListener from '../listeners/ReadlineListener.js';
import modes from './modes.js';

export default class App {
  constructor(mode, bot) {
    switch (mode) {
      case modes.DISCORD:
        this.app = new DiscordListener(bot);
        break;
      case modes.CONSOLE:
        this.app = new ReadlineListener(bot);
        break;
      default:
        throw new Error(`Invalid listener type: ${mode}`);
    }
  }

  start() {
    this.app.start();
  }
}
