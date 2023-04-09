const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('List of usable commands'),
	async execute(interaction) {
        // Create an embed with help information
        const helpEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('GitHub')
            .setURL('https://github.com/Zia-a-Mirza/JoeAI')
            .setAuthor({ name: 'JoeAI', iconURL: 'https://imgur.com/3E89GeK.png', url: 'https://github.com/Zia-a-Mirza/JoeAI' })
            .setDescription('The list of usable non slash commands')
            .setThumbnail('https://imgur.com/3E89GeK.png')
            .addFields(
                { name: '/Voice', value: 'Speak through the bot' },
                { name: '\u200B', value: '\u200B' },
                { name: '/prompt', value: 'Change Joe\'s AI' },
                { name: 'Option 1', value: 'Default\n"/prompt default"', inline: true },
                { name: 'Option 2', value: 'Shakesphere', inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: '/model', value: 'Change Joe\'s AI model' },
                { name: 'Option 1', value: 'GPT 3.5', inline: true },
                { name: 'Option 2', value: 'Davinci\n', inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'More commands coming soon!', iconURL: 'https://imgur.com/3E89GeK.png' });
        
        // Send the embed to the channel
		await interaction.reply({ embeds: [helpEmbed] });
	},
}