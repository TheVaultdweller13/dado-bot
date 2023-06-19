import commandRegex from './commandRegex.js';
import colors from './colors.js';
import text from './text.js';
import Rolls from './rolls.js';

const MAX_DICE = 500;
const MAX_FACES = 100000;
const MAX_MODIFIER = 1000;
const MIN_MODIFIER = -MAX_MODIFIER;
export default class Bot {
  constructor() {
    this.commands = [
      { name: 'roll', regex: commandRegex.ROLL, callback: this.onRoll.bind(this) },
      { name: 'help', regex: commandRegex.HELP, callback: this.onHelp.bind(this) },
      { name: 'info', regex: commandRegex.INFO, callback: this.onInfo.bind(this) },
    ];
  }

  isCommandMessage(message) {
    if (message.startsWith('!')) {
      return this.commands.some((com) => com.regex.test(message));
    }

    return false;
  }

  executeCommand(author, message) {
    const [command] = this.commands.filter(({ regex }) => regex.test(message));
    if (!command) {
      throw Error(`Error to process command\nInfo: Author: ${author} | Message: ${message}`);
    }
    return command.callback(author, message);
  }

  welcomeMessage() {
    return {
      title: text.WELCOME_TITLE,
      message: text.WELCOME,
      color: colors.GOLD,
    };
  }

  onRoll(author, command) {
    try {
      const { dice, faces, modifier } = this.parseRollCommand(command);
      const rolls = new Rolls(dice, faces);
      const sum = rolls.getSum();
      const critics = rolls.getCritics();
      const botches = rolls.getBotches();

      const rollsStrings = rolls.getFormatted();

      const modifierText = modifier ? ` + (${modifier}) = ${sum + modifier}` : '';
      const message =
        dice === 1
          ? `Tirada: ${sum}${modifierText}`
          : `Tiradas: ${rollsStrings.join(
              ', '
            )}\nTotal: ${sum}${modifierText}\nCríticos: ${critics}\nPifias: ${botches}`;
      const title = `Lanzamiento de ${author}`;
      const color = colors.RED;

      return { title, message, color };
    } catch (error) {
      if (error.constructor === RangeError) {
        return { message: text.MSG_SIZE_LIMIT_EXCEEDED, color: colors.RED };
      }
      throw error;
    }
  }

  onHelp() {
    return { title: text.HELP_TITLE, message: text.HELP, color: colors.BLUE };
  }
  onInfo() {
    return { title: text.INFO_TITLE, message: text.INFO, color: colors.GREEN };
  }

  parseRollCommand(message) {
    const match = commandRegex.ROLL.exec(message);
    if (!match) {
      throw new Error('Regex parsing failed');
    }

    const [, diceString, facesString, , operator, number] = match;
    const dice = parseInt(diceString);
    const faces = parseInt(facesString);

    if (dice > MAX_DICE) {
      throw new RangeError(`Dice amount must not exceed ${MAX_DICE}`);
    }

    if (faces > MAX_FACES) {
      throw new RangeError(`Dice faces must not exceed ${MAX_FACES}`);
    }

    const sign = operator === '+' ? 1 : -1;
    const modifier = sign * parseInt(number);

    if (modifier > MAX_MODIFIER || modifier < MIN_MODIFIER) {
      throw new RangeError(`Modifier must be between ${MAX_MODIFIER} and ${MIN_MODIFIER}`);
    }

    return { dice, faces, modifier };
  }
}
