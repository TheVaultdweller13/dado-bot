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

const WELCOME_TITLE = '¡Aquí llega dado-bot!';

const WELCOME = `
¡Gracias por invitar a dado-bot a tu servidor! 💖

Su función es permitir realizar tiradas de dados 🎲, prueba por ejemplo con !3d6 para ver el resultado de lanzar 3 dados de 6 caras.

Para aprender más sobre cómo utilizarlo, escribe !help.

¡Los que caigan al suelo **no cuentan**! 😁
`;

const UNRECOGNIZED_COMMAND = 'Comando no encontrado. Usa `!help` para ver los comandos disponibles';

const MSG_SIZE_LIMIT_EXCEEDED = '¡No puedo calcular una tirada tan grande! 😳';

const API_ERROR = 'Ocurrió algún error inesperado. Intenta probar otra vez';

export default {
  HELP,
  INFO,
  WELCOME_TITLE,
  WELCOME,
  UNRECOGNIZED_COMMAND,
  MSG_SIZE_LIMIT_EXCEEDED,
  API_ERROR,
};
