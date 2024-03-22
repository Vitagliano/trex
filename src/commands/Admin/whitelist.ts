import {Category} from '@discordx/utilities';
import {createCanvas, loadImage} from 'canvas';
import {
    ApplicationCommandOptionType,
    AttachmentBuilder,
    CommandInteraction,
    GuildMember,
    TextChannel
} from 'discord.js';
import {Client} from 'discordx';

import {Discord, Slash, SlashOption} from '@/decorators';
import {Guard, UserPermissions} from "@/guards";

@Discord()
@Category('Admin')
export class WhitelistAvatarCommand {

    @Slash({
        name: 'sendwhitelist',
        description: 'Show everyone that you are a whitelisted on Avaxsaurs!'
    })
    @Guard(
        UserPermissions(['Administrator'])
    )
    async overlay(
        @SlashOption({
            name: "userid",
            description: "The ID or username of the user",
            type: ApplicationCommandOptionType.String,
        })
            userId: string,
        interaction: CommandInteraction,
        client: Client
    ) {
        // await interaction.deferReply(); // Defer the reply to get more time for processing

        if (!interaction.guild) {
            await interaction.reply("This command can only be used on a server.");
            return;
        }

        const member: GuildMember | undefined = interaction.guild?.members.cache.get(userId) || interaction.guild?.members.cache.find(member => member.user.username.toLowerCase() === userId.toLowerCase());

        const whitelistRole = "1220064568584441856"

        if (!member) {
            await interaction.followUp({
                content: "User not found. Please provide a valid ID or username.",
                ephemeral: true
            });
            return;
        }

        const avatarUrl = member.user.displayAvatarURL({extension: 'png', size: 512}); // Get the member's avatar URL

        const canvas = createCanvas(512, 512); // Create a canvas with the same size as the avatar
        const ctx = canvas.getContext('2d');

        const avatarImage = await loadImage(avatarUrl); // Load the member's avatar
        ctx.drawImage(avatarImage, 0, 0, 512, 512); // Draw the avatar on the canvas

        const overlayImage = await loadImage('https://i.imgur.com/FJqM1ir.png'); // Load your overlay image
        ctx.drawImage(overlayImage, 0, 0, 512, 512); // Draw the overlay image on top of the avatar

        const attachment = new AttachmentBuilder(canvas.toBuffer(), {name: 'whitelisted_avatar.png'}); // Create an attachment with the resulting image

        // Reply to the user with a feedback message
        await member.roles.add(whitelistRole);
        await interaction.followUp({content: "User added to the whitelist!", ephemeral: true});
        await interaction.followUp({content: "Whitelist image sent to channel.", ephemeral: true});

        // Send the image to a specific channel
        const targetChannelId = '1220094953758392432'; // Replace with your target channel ID
        const targetChannel = await client.channels.fetch(targetChannelId) as TextChannel;
        if (targetChannel) {
            await targetChannel.send({files: [attachment]});
        } else {
            await interaction.followUp({
                content: "Failed to send the image to the specified channel.",
                ephemeral: true
            });
        }
    }

}