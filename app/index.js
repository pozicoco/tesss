const { Client, GatewayIntentBits, REST, Routes, ChannelType, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

client.commands = new Map();

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    commands.push(command.data);
}

client.once('ready', async () => {
    
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  
    try {
        await rest.put(
            Routes.applicationCommands(process.env.clientId),
            { body: commands },
        );
    } catch (error) {
        console.error(error);
    }

    console.log(`Bot起動完了!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'エラーが発生しました', ephemeral: true });
    }
});

client.login(process.env.TOKEN);