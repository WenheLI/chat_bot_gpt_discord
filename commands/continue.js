const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // set a input type
	data: new SlashCommandBuilder()
		.setName('continue')
		.setDescription('Continue the conversation.')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('Input your message')
                .setRequired(true)),
                
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
