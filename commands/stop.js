const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop the conversation.'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
