const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { client } = require('./main.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('summary')
		.setDescription('Get a summary of the conversation'),
	async execute(interaction) {
		// get message from the currnet channel
		const channel = interaction.channel;
		await interaction.reply(`Working on it!`);

		const messages = await channel.messages.fetch({
			limit: 50,
		});
		const userId = interaction.user.id;
		const topics = client.subscribeTopics[userId];

		const formattedMessages = messages.map(message => {
			return {
				'content': message.content,
				'author': message.author.username,
				'timestamp': message.createdTimestamp,
				'id': message.id,
			}});
		
		const content = formattedMessages.map((it) => {
			// constuct content into id author: content
			return `\`${it.id} ${it.author}: ${it.content}\``;
			}).join('\n');
	  
		let aiData = await axios.post('https://flask-ten-iota.vercel.app/topics', {
				topics: topics[0],
				texts: content,
		});
		// Rest of your logic goes here...
	},
};
