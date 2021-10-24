const { Client, Intents, MessageEmbed } = require('discord.js');
const CommandRegex = require('./commandRegex');
const token = process.env.DISCORD_TOKEN;

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});

client.once('ready', () => {
    console.log('Ready!');
});

const commands = [
    { name: 'roll', regex: CommandRegex.ROLL, callback: onRoll },
    { name: 'help', regex: CommandRegex.HELP, callback: onHelp },
    { name: 'info', regex: CommandRegex.INFO, callback: onInfo },
];

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!')) {
        try {
            const command = commands.find((com) => com.regex.test(message.content));
            const answer = command.callback(message);
            await message.channel.send(answer);
        }
        catch (error) {
            console.error(error);
            await message.channel.send({
                embeds: [rollEmbed('Formato incorrecto, prueba algo tipo: !1d20 o !3d8 + 3')],
            });
        }
    }
});

client.login(token);

const roll = (dice, faces, extra) => {
    const rolls = Array.apply(1, Array(dice))
        .map(() => Math.floor(Math.random() * (faces) + 1));

    const rollSum = rolls.reduce((a, b) => a + b, 0);

    return extra
        ? dice === 1
            ? `Tirada: ${rollSum} + (${extra}) = ${rollSum + extra}`
            : `Tiradas: ${rolls.join(', ')}\nTotal: ${rollSum} + (${extra}) = ${rollSum + extra}`
        : dice === 1
            ? `Tirada: ${rollSum}`
            : `Tiradas: ${rolls.join(', ')}\nTotal: ${rollSum}`;
};

const rollEmbed = (message) => new MessageEmbed()
    .setColor('#A01616')
    .setTitle('Resultado')
    .setDescription(message);

const onRoll = (message) => {
    const [, dice, faces, , operator, number] = CommandRegex.ROLL.exec(message.content);
    // operator y number son el contenido adicional p.e. +30 a la tirada
    const extra = operator && number ? eval(operator + number) : null;
    const rollMsg = roll(parseInt(dice), faces, extra);
    return { embeds: [rollEmbed(rollMsg)] };
};

const onHelp = () => {
    return { embeds: [new MessageEmbed().setDescription('Not implemented')] };
};

const onInfo = () => {
    return { embeds: [new MessageEmbed().setDescription('Not implemented')] };
};
