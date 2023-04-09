const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('voice')
		.setDescription('Speak as if you were the bot!')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('Text you want the bot to send')
				.setRequired(true))
		.addAttachmentOption(option =>
			option.setName('image')
				.setDescription('Images you want the bot to send')),
	async execute(interaction, client) {

		//Get the users text and attachments
		const message = interaction.options.getString('input');
		const image = interaction.options.getAttachment("image");

		await interaction.channel.send({
    		content: message,
    		files: image ? [image] : undefined,
    		ephemeral: false
		});
		
		//Give the user a private reply confirming the command was successful
		await interaction.reply({
			content: ':white_check_mark:',
			ephemeral: true
		});

		return;
		
	},
}
