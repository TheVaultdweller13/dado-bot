const { Client, Intents, MessageEmbed } = require('discord.js');
const CommandRegex = require('./commandRegex');
const text = require('./text');
const token = process.env.DISCORD_TOKEN;

const onRoll = (message) => {
    const [, dice, faces, , operator, number] = CommandRegex.ROLL.exec(message.content);
    // operator y number son el contenido adicional p.e. +30 a la tirada
    const extra = operator && number ? eval(operator + number) : null;
    const rollMsg = roll(parseInt(dice), faces, extra);
    return { embeds: [rollEmbed(rollMsg, message.author.username)] };
};

const onHelp = () => {
    return { content: text.HELP };
};

const onInfo = () => {
    return { content: text.INFO };
};

const makeAnswer = (message) => {
    try {
        const command = commands.find((com) => com.regex.test(message.content));
        return command.callback(message);
    }
    catch (error) {
        console.warn(error);
        return {
            content: 'Comando no encontrado. Usa `!help` para ver los comandos disponibles',
        };
    }
};

const reply = async (message, answer) => {
    try {
        await message.channel.send({ ...answer, reply: { messageReference: message, failIfNotExists: false } });
    }
    catch (error) {
        console.error(error);
    }
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
    console.log('Ready!');
    client.channels.cache.get('901110509758189641').send('Aquí estoy, payasos. 🤡');
});

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!')) {
        const answer = makeAnswer(message);
        reply(message, answer);
    }
});

client.on('guildCreate', async (guild) => {
    await guild.systemChannel.send({ content: text.WELCOME });
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
