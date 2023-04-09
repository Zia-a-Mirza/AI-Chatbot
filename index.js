//A discord bot to interact with users using OpenAI's API
require('dotenv').config();
const joeify = require('./joeify.js');

//Command handler
const fs = require('node:fs');
const path = require('node:path');

//Connect to the Discord API
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

//Set up the command handler
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

//Execute commands
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//Connect to the OpenAI API
const { Configuration , OpenAIApi } = require('openai');
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY,
})
const openai = new OpenAIApi(configuration);

var model = "text-davinci-003";
var shakesphereToggle = false;
var defaultToggle = true;


var respondCounter = 0;
var respondLimit = Math.floor(Math.random() * 2) + 1;
client.on('messageCreate', async function (message) {
    try {

        //Return redundant messages
        if(message.content == null) return;
        if(message.system) return;
        if (message.stickers.size > 0) return;

        //Retrieve the text message content
        let text = message.content;
        text = text.replaceAll(/<@[0-9]+>/g, "");

        //Code for the /prompt command
        if (text.startsWith("/prompt ")) {
            text = text.substring(7, text.length);
            if(text === null || message.author.bot) return;
            //Cleans up the text content
            text = text.trim();
            text = text.toLowerCase();

            //Set the bot to the default personality
            if (text === 'default') {
                defaultToggle = true;
                shakesphereToggle = false;
            //Set the bot to have a Shakespheren personality
            } else if (text === 'shakesphere') {
                defaultToggle = false;
                shakesphereToggle = true;
            } else {
                message.reply("That is not one of the options :x:");
                return;
            }
            message.reply("Switched personalities :white_check_mark:");
            return;
        }

        //Each personality for the bot is stored in a seperate prompt
        if (defaultToggle) {
            //Default Joe
            var prompt = `Joe is a sarcastic human who responds in a witty manner, at the end of every sentence he says his emotion. Use the following examples as a guide.\n\
            ${message.author.username}: Hello\n\
            Joe: Hey! How can I help you? <happy>\n\
            ${message.author.username}: What are you doing right now?\n\
            Joe: Talking to you, that's about it <bored> \n\
            ${message.author.username}: ${text}\n\
            Joe:` 
        } else if (shakesphereToggle) {
            //Shakesphearen Joe
            var prompt = `Joe is a person from the victorian era that talks like shakespeare but in a very poetic manner. He speaks mostly through poems and rhymes. Use the following examples as a guide.\n\
            ${message.author.username}: Hello!\n\
            Joe: Good dawning to thee, friend\n\
            ${message.author.username}: See you later\n\
            Joe: Out of my sight! Thou dost infect my eyes\n\
            ${message.author.username}: ${text}\n\
            Joe:`
        }

        //Code for the /model command
        if (text.startsWith("/model ")) {
            text = text.substring(6, text.length);
            if((text === null) || (message.author.bot)) return;
            text = text.trim();
            text = text.toLowerCase();
            
            //Change the AI model to either GPT 3.5 turbo or Davinci-003
            if (text === 'gpt 3.5') {
                model = "gpt-3.5-turbo";
            } else if (text === 'davinci') {
                model = "text-davinci-003";
            } else {
                message.reply("That is not one of the options :x:");
                return;
            }
            message.reply("Switched models :white_check_mark:");
            return;
        }

        //Return bot texts
        if(message.author.bot) return;

        //Code for the original AI
        if (respondCounter >= respondLimit) {
            respondLimit = Math.floor(Math.random() * 2) + 1;
            respondCounter = 0;
        }

        //Ensures the bot doesnt reply to itself
        if (respondCounter === 0) {
            if(!message.mentions.has(client.user)) return;
        }
        respondCounter++;

        //Generate a response
        const gptResponse = await openai.createCompletion({
            model: model,
            prompt: prompt,
            temperature: 0.9,
            max_tokens: 150,
        });

        // Reply with the generated response
        let response = gptResponse.data.choices[0].text;
        response = joeify(response);

        function splitMessage(response) {
            //Stagger the responses if applicable
            let hasResponded = false;
            const keywords = [","];

            //Split message with commas as seperators
            keywords.forEach(keyword => {
            if (response.toLowerCase().includes(keyword)) {
                const splitResponse = response.split(",");
                for (let i = 0; i < splitResponse.length; i++) {
                    if (i === 0) {
                        //Reply on only the first message
                        message.reply(splitResponse[i]);
                    } else {
                        message.channel.send(splitResponse[i]);
                    }
                }
                hasResponded = true;
            }
            });

            if (!hasResponded) {
                message.reply(response);
                hasResponded = true;
            }
        }

        //Display the bot's response to the console
        console.log(response);

        //Delay the bots responses depending on the response length
        message.channel.sendTyping();
        setTimeout(() => {
            splitMessage(response);
        }, Math.sqrt(response.length) * 150);

        return;

    } catch (err) {
        console.log(err)
    }
});

// Set the bot's activity and status
client.on("ready", () => {
    const { ActivityType } = require('discord.js');
    client.user.setActivity('activity', { type: ActivityType.Watching });
    client.user.setPresence({ activities: [{ name: 'OpenAI' }], status: 'idle' });
})

//Log the bot into Discord server
client.login(process.env.DISCORD_TOKEN);
console.log('Bot is now online');