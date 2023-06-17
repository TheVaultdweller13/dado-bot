# dado-bot

Virtual die for Discord

### Requeriments:
- Node (v16+)
- npm

## Installation
- Install dependencies:
```
> npm install
```
- Create a Discord bot by following [the official guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html)
- Export your bot's token:
  
```bash
# Linux & MAC
> export DISCORD_TOKEN="YOUR_BOT_TOKEN_HERE"
```
```bash
# Windows (CMD)
> set DISCORD_TOKEN="YOUR_BOT_TOKEN_HERE"
```
```bash
# Windows (PowerShell)
> $env:DISCORD_TOKEN="YOUR_BOT_TOKEN_HERE"
```
- Run the application:
```
> npm start
```
- Invite the bot to your server. [See the official guide](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links)

## Commands
- `!help`: See commands help
- `!info`: See bot info
- `!XdY`: Roll X dice of Y faces

## License
[ISC](https://en.wikipedia.org/wiki/ISC_license)
