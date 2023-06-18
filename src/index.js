import { Client, GatewayIntentBits, EmbedBuilder, DiscordAPIError, TextChannel } from 'discord.js';
import commandRegex from './commandRegex.js';
import text from './text.js';
import config from '../config.json' assert { type: 'json' };

const EMBED_MESSAGE_COLOR = '#A01616';
const MAX_DICE = 1000;
const MAX_FACES = 100000;
const token = config.token;

const parseRollCommand = (message) => {
  const match = commandRegex.ROLL.exec(message.content);
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

  return { dice, faces, modifier };
};

const onRoll = (message) => {
  const { dice, faces, modifier } = parseRollCommand(message);
  const rolls = Array(dice)
    .fill(undefined)
    .map(() => Math.floor(Math.random() * faces + 1));
  const sum = rolls.reduce((a, b) => a + b, 0);
  const modifierText = modifier ? ` + (${modifier}) = ${sum + modifier}` : '';
  const rollMsg =
    dice === 1 ? `Tirada: ${sum}${modifierText}` : `Tiradas: ${rolls.join(', ')}\nTotal: ${sum}${modifierText}`;

  return {
    embeds: [
      new EmbedBuilder()
        .setColor(EMBED_MESSAGE_COLOR)
        .setTitle(`Lanzamiento de ${message.author.username}`)
        .setDescription(rollMsg),
    ],
  };
};

const onHelp = () => getContent(text.HELP);
const onInfo = () => getContent(text.INFO);

const makeAnswer = (message) => {
  const command = commands.find((com) => com.regex.test(message.content));
  if (!command) {
    throw new Error('Unrecognized command');
  }
  return command.callback(message);
};

const getContent = (message) => {
  return {
    content: message,
  };
};

const reply = async (message, answer) => {
  await message.channel.send({ ...answer, reply: { messageReference: message, failIfNotExists: false } });
};

const commands = [
  { name: 'roll', regex: commandRegex.ROLL, callback: onRoll },
  { name: 'help', regex: commandRegex.HELP, callback: onHelp },
  { name: 'info', regex: commandRegex.INFO, callback: onInfo },
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', async () => {
  try {
    console.log('Ready!');
  } catch (error) {
    console.warn(error);
  }
});

client.on('messageCreate', async (message) => {
  try {
    if (!message.author.bot || message.content.startsWith('!')) {
      await message.channel.sendTyping();
      const answer = makeAnswer(message);
      await reply(message, answer);
    }
  } catch (error) {
    console.warn(error);

    /** @type {TextChannel} */
    // @ts-ignore this would require casting, not available in JS
    const channel = client.channels.cache.get(message.channel.id);

    switch (error.constructor) {
      case RangeError:
        await channel?.send(text.MSG_SIZE_LIMIT_EXCEEDED);
        return;
      case DiscordAPIError:
        await channel?.send(text.API_ERROR);
        return;
      default:
        await channel?.send(text.UNRECOGNIZED_COMMAND);
    }
  }
});

client.on('guildCreate', async (guild) => {
  try {
    await guild.systemChannel?.send({
      embeds: [new EmbedBuilder().setTitle(text.WELCOME_TITLE).setDescription(text.WELCOME)],
    });
  } catch (error) {
    console.error('Error entering new guild: ' + error);
  }
});

client.login(token);
