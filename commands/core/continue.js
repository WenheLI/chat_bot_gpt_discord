// const { SlashCommandBuilder } = require('discord.js');

// module.exports = {
//     // set a input type
// 	data: new SlashCommandBuilder()
// 		.setName('continue')
// 		.setDescription('Continue the conversation.')
//         .addStringOption(option =>
//             option.setName('input')
//                 .setDescription('Input your message')
//                 .setRequired(true)),
                
// 	async execute(interaction) {
// 		await interaction.reply('Pong!');
// 	},
// };

const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('continue')
		.setDescription('Continue the conversation'),
	async execute(interaction) {
		if (global.users2Memory[interaction.user.id] == undefined) {
			await interaction.reply('Please run /summary first.');
			return;
		}
		const userId = interaction.user.id;
		const memory = global.users2Memory[userId];
		const aiData = await axios.post('https://flask-ten-iota.vercel.app/continue', {
				memory: memory,
				text: interaction.options.get('input').value,
		});
		const text = aiData.data.text;
		console.log(typeof global.users2Memory[userId])
		global.users2Memory[userId].push({
			'role': 'assistant',
			'content': text,
		})
		await interaction.reply(text);
	},
};
