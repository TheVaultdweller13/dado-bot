import chalk from 'chalk';
import os from 'os';
import markdownChalk from 'markdown-chalk'

export default class ReadlineListener {
  constructor(bot, client) {
    this.bot = bot;
    this.client = client;
    this.username = os.userInfo().username;

    client.on('line', this.onCommand.bind(this));
  }

  onCommand(command) {
    if (this.bot.isCommandMessage(command)) {
      const { title, message, color } = this.bot.executeCommand(this.username, command);
      const hexColor = '#' + color.toString(16);
      console.log(chalk.hex(hexColor).bold(title));
      console.log(markdownChalk(message));
    }
    this.client.prompt();
  }
}
