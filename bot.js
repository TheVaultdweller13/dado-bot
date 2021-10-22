const { Client, Intents, MessageEmbed } = require('discord.js');
const token = process.env.DISCORD_TOKEN;

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});

client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', async message => {
    if (message.content.startsWith('!')) {
        const commandRegex = /!(\d+)d(\d+)(\s?(\+|-)\s?(\d+))?/;
        try {
            const [ , dice, faces, , operator, number ] = commandRegex.exec(message.content);
            // operator y number son el contenido adicional p.e. +30 a la tirada
            const extra = operator && number ? eval(operator + number) : null;
            const rollMsg = roll(dice, faces, extra);
            await message.channel.send({ embeds: [rollEmbed(rollMsg)] });
        }
        catch (error) {
            console.error(error);
            await message.channel.send({ embeds: [rollEmbed('Formato incorrecto, prueba algo tipo: !1d20 o !3d8 + 3')] });
        }
    }
});

client.login(token);

const roll = (dice, faces, extra) => {
    const rolls = Array.apply(1, Array(parseInt(dice)))
        .map(() => Math.floor(Math.random() * (faces) + 1));

    const rollSum = rolls.reduce((a, b) => a + b, 0);

    return extra
        ? parseInt(dice) === 1
            ? `Tirada: ${rollSum} + (${extra}) = ${rollSum + extra}`
            : `Tiradas: ${rolls.join(', ')}\nTotal: ${rollSum} + (${extra}) = ${rollSum + extra}`
        : parseInt(dice) === 1
            ? `Tirada: ${rollSum}`
            : `Tiradas: ${rolls.join(', ')}\nTotal: ${rollSum}`;
};

const rollEmbed = (message) => new MessageEmbed()
    .setColor('#A01616')
    .setTitle('Resultado')
    .setDescription(message);
