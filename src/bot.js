require('dotenv').config({path: '../.env'});

const { Client, Intents, WebhookClient } = require('discord.js');
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  partials: ['MESSAGE', 'REACTION']
});
const webhookClient = new WebhookClient(
  process.env.WEBHOOK_ID,
  process.env.WEBHOOK_TOKEN
);
const prefix = "$";

client.on('ready', ()=> {
  console.log(client.user.tag + 'has logged in');
})
client.on('messageCreate', async (message) => {
  if(message.author.bot) {
    return ;
  }
  if(message.content.startsWith(prefix)) {
    const [cmdName, ...args] = message.content
    .trim()
    .substring(prefix.length)
    .split(/\s+/);
    if(cmdName === 'kick') {
      if(!message.member.permissions.has('KICK_MEMBERS')) {
        return message.reply('You do not have permissions to use that command');
      }
      if(args.length === 0) {
        return message.reply("please enter id");
      }
      const member = message.guild.members.cache.get(args[0]);
      if(member) {
        member
        .kick()
        .then((member)=>message.channel.send(member + 'was kicked'))
        .catch((err) => message.channel.send("I dont have permissions"));
      }
      else {
        message.channel.send("member not found");
      }
    }
    else if(cmdName === 'ban') {
      if(!message.member.permissions.has('BAN_MEMBERS')) {
        return message.reply('You do not have permissions to use that command');
      }
      if(args.length === 0) {
        return message.reply("please enter id");
      }
      try {
        const user = await message.guild.members.ban(args[0]);
        message.channel.send('user banned successfully.');
      }
      catch(err) {
        console.log(err);
        message.channel.send('an error occured');
      }
    }
    else if(cmdName === 'announcements') {
      console.log(args);
      const msg = args.join(' ');
      console.log(msg);
      webhookClient.send(msg);
    }
  }
});
client.on('messageReactionAdd', (reaction, user)=> {
  console.log('hello');
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if(reaction.message.id === "986387795419488356") {
    switch(name) {
      case '🍎':
      member.roles.add('986385708426084402');
      break;
      case '🥭':
      member.roles.add('986385888940527678');
      break;
      case '🍇':
      member.roles.add('986385937250541598');
      break;
    }
  }
});
client.on('messageReactionRemove', (reaction, user)=> {
  console.log('hello');
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if(reaction.message.id === "986387795419488356") {
    switch(name) {
      case '🍎':
      member.roles.remove('986385708426084402');
      break;
      case '🥭':
      member.roles.remove('986385888940527678');
      break;
      case '🍇':
      member.roles.remove('986385937250541598');
      break;
    }
  }
});
client.login(process.env.DISCORDJS_BOT_TOKEN);
