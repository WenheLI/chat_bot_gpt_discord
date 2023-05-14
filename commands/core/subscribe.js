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
        const topic = interaction.options.get('input').value;
        const userId = interaction.user.id;
        subscribeTopics[userId] = [topic];
        console.log(subscribeTopics);
        await interaction.reply(`You have subscribed to ${topic}`);
	},
};
