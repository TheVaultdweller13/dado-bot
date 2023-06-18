const HELP_TITLE = 'Instrucciones de uso';

const HELP = `
Para usar el dado virtual escribe el prefijo \`!\` y a continuación tu tirada de dados. 
Permite sumar y restar a la tirada final con los operadores \`+\` y \`-\`

Ejemplos:
- Tirar un dado de veinte: \`!1d20\`
- Tirar tres dados de seis: \`!3d6\`
- Tirar dos dados de diez y sumarle cinco al resultado final: \`!2d10 + 5\`

Comandos:
  \`!XdY\`: tira X dados de Y caras
  \`!help\`: muestra este mensaje de ayuda
  \`!info\`: muestra información sobre el bot`;

const INFO_TITLE = 'Información';

const INFO = `
Este es un bot de lanzamiento de dados para Discord creado por thevaultdweller13 y nirrosis.

Si quieres sugerir una nueva funcionalidad o encuentras un error, por favor, ábrenos un [bug en GitHub](https://github.com/TheVaultdweller13/dado-bot/issues) o contacta con nosotros vía Discord.

`;

const WELCOME_TITLE = '¡Aquí llega dado-bot!';

const WELCOME = `
¡Gracias por invitar a [dado-bot](https://github.com/TheVaultdweller13/dado-bot) a tu servidor! 💖

Su función es realizar tiradas de dados 🎲, prueba por ejemplo con !3d6 para ver el resultado de lanzar 3 dados de 6 caras.

Para aprender más sobre cómo utilizarlo, escribe !help.

¡Los que caigan al suelo **no cuentan**! 😁
`;

const MSG_SIZE_LIMIT_EXCEEDED = '¡No puedo calcular una tirada tan grande! 😳';

const GENERIC_ERROR = 'Ocurrió un error inesperado. Espera un poco y prueba de nuevo.';

export default {
  HELP_TITLE,
  HELP,
  INFO_TITLE,
  INFO,
  WELCOME_TITLE,
  WELCOME,
  MSG_SIZE_LIMIT_EXCEEDED,
  GENERIC_ERROR,
};
