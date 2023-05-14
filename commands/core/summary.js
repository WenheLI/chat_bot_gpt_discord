const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

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
		const topics = global.subscribeTopics[userId];

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
				topics: "breakfast",
				texts: content,
		});
        responseStr = aiData.data['text'];
        global.users2Memory[userId] = JSON.parse(aiData.data['memory']);

        console.log(responseStr);
        lines = responseStr.split('\n');
        const topic = lines[0].replace('Topic: ', '');
        const summary = lines[1].replace('Summary: ', '');
        if (lines.length <= 3){
            await interaction.editReply("No relevant message found for this topic");
        }
        else{
            let parsedData = lines.slice(3).map((it) => {
                const regex = /^[-\*\s]*(\d+)\s+(\w+):\s+(.+)$/;
                const match = it.match(regex);
                if (match) {
                    const messageId = match[1];
                    const sender = match[2];
                    const content = match[3];
                    const timeStamp = formattedMessages.find((it) => it.id === messageId).timestamp;
                    return {messageId, sender, content, timeStamp};
                }
                return null;
            }).filter((it) => it);

            console.log(parsedData);
            if (parsedData.length === 0) {
                await interaction.editReply("No relevant message found for this topic");
                return;
            }

            parsedData.sort((a, b) => a.timeStamp - b.timeStamp);
            const groupedData = [[parsedData[0]]];
            for (let i = 1; i < parsedData.length; i++) {
                if (parsedData[i].timeStamp - parsedData[i - 1].timeStamp > 1000 * 60 * 20) {
                    groupedData.push([parsedData[i]]);
                }
                else {
                    groupedData[groupedData.length - 1].push(parsedData[i]);
                }
            }
            console.log(parsedData);
            console.log(groupedData);


            let responseMsg = `Topic: ${topic}\nSummary: ${summary}\nRelated Messages\n`;
            for (let i = 0; i < groupedData.length; i++) {
                responseMsg += `Relevant dialogue ${i + 1}: \n`;
                for (let j = 0; j < groupedData[i].length; j++) {
                    const msg = groupedData[i][j];
                    responseMsg += `\t${msg.sender}: ${msg.content}\n`;
                }
            }
            responseMsg += "\nJump to: ";
            const buttons = [];
            for (let i = 0; i < groupedData.length; i++) {
                buttons.push(new ButtonBuilder()
                    .setURL(`https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${groupedData[i][0].messageId}`)
                    .setLabel(`Dialogue ${i + 1}`)
                    .setStyle(ButtonStyle.Link));
            }
            const row = new ActionRowBuilder()
                .addComponents(...buttons);

            await interaction.editReply({content: responseMsg, components: [row]});
        }
	},
};
