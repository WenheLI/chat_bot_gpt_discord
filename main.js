// Require the necessary discord.js classes
const { token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

// user_name to topics
const subscribeTopics = {
}

const users2Channels = {
}

const users2Memory = {
}

let global_channel_id = '1106969100279889953';

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
        console.log(`[INFO] Loading command ${command.data.name} from ${filePath}`);
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
// Create a new client instance

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    console.log(`Interaction received: ${interaction.commandName}`);
	if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName == 'subscribe') {
        const topic = interaction.options.get('input').value;
        const userId = interaction.user.id;
        if (!(userId in subscribeTopics)) {
            subscribeTopics[userId] = [];
        }
        subscribeTopics[userId].push(topic);
        console.log(subscribeTopics);
        await interaction.reply(`You have subscribed to ${topic}`);
    }

    if (interaction.commandName == 'summary') {
        // get message from the currnet channel
        const channel = interaction.channel;
        await interaction.reply(`Working on it!`);

        const messages = await channel.messages.fetch({
            limit: 100,
        });
        const userId = interaction.user.id;
        const topics = subscribeTopics[userId];

        const formattedMessages = messages.map(message => {
            return {
                'content': message.content,
                'author': message.author.username,
                'timestamp': message.createdTimestamp,
                'id': message.id,
            }});
        
        const content = formattedMessages.map((it) => {
            // constuct content into id author: content
            return `${it.id} ${it.author}: ${it.content}`;
            }).join('\n');
        let aiData = await axios.post('https://flask-sandy-pi.vercel.app/topics', {
                topics: "topics[0],",
                texts: content,
        });
        
        aiData = aiData.data;
        aiData, memory = aiData.text, aiData.memory;

        users2Memory[userId] = memory;

        interaction.editReply("got data")
    }

    if (interaction.commandName == 'continue') {
        if (users2Memory[interaction.user.id] == undefined) {
            await interaction.reply('Please run /summary first.');
            return;
        }
        const userId = interaction.user.id;
        const memory = users2Memory[userId];
        const topics = subscribeTopics[userId];
        const aiData = await axios.post('https://flask-sandy-pi.vercel.app/topics', {
                topics: topics.join(','),
                texts: memory,
        });
        const text = aiData.data.text;
        users2Memory[userId].push({
            'role': 'assistant',
            'content': text,
        })
        await interaction.reply(text);
    }

    if (interaction.commandName == 'stop') {
        const userId = interaction.user.id;
        delete users2Memory[userId];
        await interaction.reply('Conversation stopped.');
    }
});

// Log in to Discord with your client's token
client.login(token);
