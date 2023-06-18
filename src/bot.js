import commandRegex from './commandRegex.js';
import colors from './colors.js';
import text from './text.js';

const MAX_DICE = 500;
const MAX_FACES = 100000;
const MAX_MODIFIER = 1000;

const parseRollCommand = (message) => {
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

  if (modifier > MAX_MODIFIER) {
    throw new RangeError(`Modifier must not exceed ${MAX_MODIFIER}`);
  }

  return { dice, faces, modifier };
};

const onRoll = (author, command) => {
  try {
    const { dice, faces, modifier } = parseRollCommand(command);
    const rolls = Array(dice)
      .fill(undefined)
      .map(() => Math.floor(Math.random() * faces + 1));
    const sum = rolls.reduce((a, b) => a + b, 0);
    const modifierText = modifier ? ` + (${modifier}) = ${sum + modifier}` : '';
    const message =
      dice === 1 ? `Tirada: ${sum}${modifierText}` : `Tiradas: ${rolls.join(', ')}\nTotal: ${sum}${modifierText}`;
    const title = `Lanzamiento de ${author}`;
    const color = colors.RED;

    return { title, message, color };
  } catch (error) {
    if (error.constructor === RangeError) return { message: text.MSG_SIZE_LIMIT_EXCEEDED, color: colors.RED };
    throw error;
  }
};

const onHelp = () => ({ title: text.HELP_TITLE, message: text.HELP, color: colors.BLUE });
const onInfo = () => ({ title: text.INFO_TITLE, message: text.INFO, color: colors.GREEN });

const commands = [
  { name: 'roll', regex: commandRegex.ROLL, callback: onRoll },
  { name: 'help', regex: commandRegex.HELP, callback: onHelp },
  { name: 'info', regex: commandRegex.INFO, callback: onInfo },
];

export default class Bot {
  isCommandMessage(message) {
    if (message.startsWith('!')) {
      return commands.some((com) => com.regex.test(message));
    }

    return false;
  }

  executeCommand(author, message) {
    const command = commands.find((com) => com.regex.test(message));
    if (!command) {
      return null;
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
}
