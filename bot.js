const { Client, Intents, MessageEmbed } = require('discord.js');
const CommandRegex = require('./commandRegex');
const token = process.env.DISCORD_TOKEN;

const onRoll = (message) => {
    const [, dice, faces, , operator, number] = CommandRegex.ROLL.exec(message.content);
    // operator y number son el contenido adicional p.e. +30 a la tirada
    const extra = operator && number ? eval(operator + number) : null;
    const rollMsg = roll(parseInt(dice), faces, extra);
    return { embeds: [rollEmbed(rollMsg, message.author.username)] };
};

const onHelp = () => {
    return { embeds: [helpEmbed()] };
};

const onInfo = () => {
    return { embeds: [new MessageEmbed().setDescription('Not implemented')] };
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

const rollEmbed = (message, author) => new MessageEmbed()
    .setColor('#A01616')
    .setTitle(`Lanzamiento de ${author}`)
    .setDescription(message);

const helpEmbed = () => new MessageEmbed
    .setTitle('Ayuda')
    .setDescription(`
        \`\`\`
        Para usar el dado virtual escribe el prefijo '!' y a continuación tu tirada de dados. 
        Permite sumar y restar a la tirada final con los operadores + y -

        Ejemplos:
            - Tirar un dado de veinte: !1d20
            - Tirar tres dados de seis: !3d6
            - Tirar dos dados de diez y sumarle cinco al resultado final: !2d10 + 5
        \`\`\` 
        `);
