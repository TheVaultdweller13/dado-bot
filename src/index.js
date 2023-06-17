import { Client, GatewayIntentBits, EmbedBuilder, DiscordAPIError } from "discord.js";
import CommandRegex from "./commandRegex.js";
import text from "./text.js";
import config from "../config.json" assert { type: "json" };

const EMBED_MESSAGE_COLOR = "#A01616";
const token = config.discordToken;

const onRoll = (message) => {
  const [, dice, faces, , operator, number] = CommandRegex.ROLL.exec(message.content);
  if (dice > 1000 || faces > 100000) {
    throw new RangeError();
  }
  // operator y number son el contenido adicional p.e. +30 a la tirada
  const extra = operator && number ? eval(operator + number) : null;
  const rollMsg = roll(parseInt(dice), faces, extra);
  return { embeds: [rollEmbed(rollMsg, message.author.username)] };
};

const onHelp = () => getContent(text.HELP);
const onInfo = () => getContent(text.INFO);

const makeAnswer = (message) => {
  const command = commands.find((com) => com.regex.test(message.content));
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
  { name: "roll", regex: CommandRegex.ROLL, callback: onRoll },
  { name: "help", regex: CommandRegex.HELP, callback: onHelp },
  { name: "info", regex: CommandRegex.INFO, callback: onInfo },
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", async () => {
  try {
    console.log("Ready!");
  } catch (error) {
    console.warn(error);
  }
});

client.on("messageCreate", async (message) => {
  try {
    if (message.content.startsWith("!")) {
      await message.channel.sendTyping();
      const answer = makeAnswer(message);
      await reply(message, answer);
    }
  } catch (error) {
    console.warn(error);
    switch (error.constructor) {
      case RangeError:
      case DiscordAPIError:
        return await client.channels.cache.get(message.channel.id).send(text.MSG_SIZE_LIMIT_EXCEEDED);
      default:
        return await client.channels.cache.get(message.channel.id).send(text.UNRECOGNIZED_COMMAND);
    }
  }
});

client.on("guildCreate", async (guild) => {
  try {
    await guild.systemChannel.send({
      embeds: [new EmbedBuilder().setTitle(text.WELCOME_TITLE).setDescription(text.WELCOME)],
    });
  } catch (error) {
    console.error("Error entering new guild: " + error);
  }
});

client.login(token);

const roll = (dice, faces, extra) => {
  const rolls = Array(dice)
    .fill(undefined)
    .map(() => Math.floor(Math.random() * faces + 1));

  const rollSum = rolls.reduce((a, b) => a + b, 0);
  const extraResult = extra ? ` + (${extra}) = ${rollSum + extra}` : "";

  return dice === 1
    ? `Tirada: ${rollSum}${extraResult}`
    : `Tiradas: ${rolls.join(", ")}\nTotal: ${rollSum}${extraResult}`;
};

const rollEmbed = (message, author) =>
  new EmbedBuilder().setColor(EMBED_MESSAGE_COLOR).setTitle(`Lanzamiento de ${author}`).setDescription(message);
