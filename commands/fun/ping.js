const { SlashCommandBuilder } = require('discord.js');

const cowsay = require("cowsay");

let cowSays = cowsay.say({
    text : "It's time to poop!",
    e : "oO",
    T : "U "
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with cowsay'),
	async execute(interaction) {
		await interaction.reply(cowSays);
	},
};
