const { Client, Intents, MessageEmbed } = require('discord.js');
const CommandRegex = require('./commandRegex');
const text = require('./text');
const token = process.env.DISCORD_TOKEN;
const channelId = process.env.CHANNEL_ID;

const onRoll = (message) => {
    const [, dice, faces, , operator, number] = CommandRegex.ROLL.exec(message.content);
    // operator y number son el contenido adicional p.e. +30 a la tirada
    const extra = operator && number ? eval(operator + number) : null;
    const rollMsg = roll(parseInt(dice), faces, extra);
    return { embeds: [rollEmbed(rollMsg, message.author.username)] };
};

const onHelp = () => getContent(text.HELP);
const onInfo = () => getContent(text.INFO);

const makeAnswer = (message) => {
    try {
        const command = commands.find((com) => com.regex.test(message.content));
        return command.callback(message);
    }
    catch (error) {
        console.warn(error);
        return error instanceof RangeError
            ? getContent('Introduce un conjunto más pequeño')
            : getContent('Comando no encontrado. Usa `!help` para ver los comandos disponibles');
    }
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
    { name: 'roll', regex: CommandRegex.ROLL, callback: onRoll },
    { name: 'help', regex: CommandRegex.HELP, callback: onHelp },
    { name: 'info', regex: CommandRegex.INFO, callback: onInfo },
];

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});

client.once('ready', () => {
    try {
        console.log('Ready!');
        channelId && client.channels.cache.get(channelId).send('¡dado-bot se ha conectado!');
    }
    catch (error) {
        console.warn(`Error sending readiness message to channel (${channelId})` + error);
    }
});

client.on('messageCreate', async (message) => {
    try {
        if (message.content.startsWith('!')) {
            message.channel.sendTyping();

            const answer = makeAnswer(message);
            reply(message, answer);
        }
    }
    catch (error) {
        console.error('Error processing incoming message: ' + error);
    }
});

client.on('guildCreate', async (guild) => {
    try {
        await guild.systemChannel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle(text.WELCOME_TITLE)
                    .setDescription(text.WELCOME),
            ],
        });
    }
    catch (error) {
        console.error('Error entering new guild: ' + error);
    }
});

client.login(token);

const roll = (dice, faces, extra) => {
    const rolls = Array.apply(1, Array(dice))
        .map(() => Math.floor(Math.random() * faces + 1));

    const rollSum = rolls.reduce((a, b) => a + b, 0);

    return extra
        ? dice === 1
            ? `Tirada: ${rollSum} + (${extra}) = ${rollSum + extra}`
            : `Tiradas: ${rolls.join(', ')}\nTotal: ${rollSum} + (${extra}) = ${rollSum + extra}`
        : dice === 1
            ? `Tirada: ${rollSum}`
            : `Tiradas: ${rolls.join(', ')}\nTotal: ${rollSum}`;
};

const rollEmbed = (message, author) => new MessageEmbed()
    .setColor('#A01616')
    .setTitle(`Lanzamiento de ${author}`)
    .setDescription(message);
