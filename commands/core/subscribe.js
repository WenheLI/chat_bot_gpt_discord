const { SlashCommandBuilder } = require('discord.js');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('subscribe')
		.setDescription('Subscribe to a channel.')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('Input your message')
                .setRequired(true)),
                
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
