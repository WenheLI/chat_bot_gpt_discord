// Description: Stop the conversation
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop the conversation'),
	async execute(interaction) {
		const userId = interaction.user.id;
		delete global.users2Memory[userId];
		await interaction.reply('Conversation stopped.');
	},
};
