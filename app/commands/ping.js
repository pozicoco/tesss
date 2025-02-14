const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('ping!'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};
