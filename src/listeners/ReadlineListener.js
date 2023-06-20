import readline from 'readline';
import chalk from 'chalk';
import os from 'os';
import markdownChalk from 'markdown-chalk';

export default class ReadlineListener {
  constructor(bot) {
    this.bot = bot;
    this.client = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> ',
    });
    this.username = os.userInfo().username;

    this.client.on('line', this.onCommand.bind(this));
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

  login() {
    console.log('Console mode enabled, use Ctrl+D to finish');
    this.client.prompt();
  }
}
