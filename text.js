const HELP = `
\`\`\`
Para usar el dado virtual escribe el prefijo '!' y a continuación tu tirada de dados. 
Permite sumar y restar a la tirada final con los operadores + y -

Ejemplos:
    - Tirar un dado de veinte: !1d20
    - Tirar tres dados de seis: !3d6
    - Tirar dos dados de diez y sumarle cinco al resultado final: !2d10 + 5

Comandos:
    !XdY: tira X dados de Y caras
    !help: muestra este mensaje de ayuda
    !info: muestra información sobre el bot
\`\`\``;

const INFO = `
Este es un bot de lanzamiento de dados para Discord creado por TheVaultdweller13#6426 y Nirei#7437.

Si quieres sugerir una nueva funcionalidad o encuentras un error, por favor, ábrenos un bug en GitHub o contacta con nosotros vía Discord.
https://github.com/TheVaultdweller13/dado-bot/issues
`;

module.exports = {
    HELP,
    INFO,
};