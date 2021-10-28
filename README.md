# dado-bot

Virtual die for Discord

### Requeriments:
- Node (v16+)
- npm

## Installation
- Install dependencies with `npm install`
- Create a Discord bot by following [the official guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html)
- Create a `config.json` with your bot's `token` and replace the `token` parameter in the `bot.js` module. Example:
```json
{
   "token" : "YOUR_BOT_TOKEN_HERE"
}
```
- Run the application with `npm start`
- Invite the bot to your server. [See the official guide](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links)

## Commands
- `!help`: See commands help
- `!info`: See bot info
- `!XdY`: Roll X dice of Y faces

## License
[ISC](https://en.wikipedia.org/wiki/ISC_license)