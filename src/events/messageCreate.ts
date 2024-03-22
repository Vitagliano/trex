import {ArgsOf, Client} from 'discordx'

import {Discord, Guard, On} from '@/decorators'
import {Maintenance} from '@/guards'


const RandomResponsesGM = [
    "GM ☀️",
    "Good morning! ☀️",
    "Hello, how are you today?",
    "I hope you have a great day!",
    "GM! Ready for a new day?",
    "May the sun shine brightly for you today!",
];


@Discord()
export default class MessageCreateEvent {

    @On('messageCreate')
    @Guard(
        Maintenance
    )
    async messageCreateHandler(
        [message]: ArgsOf<'messageCreate'>,
        client: Client
    ) {
        // Prevent the bot from responding to its own messages or other bots
        if (!client) return;
        if (message.author.bot) return;

        const messageContent = message.content.toLowerCase(); // Make everything lowercase to avoid case sensitivity

        const randomResponseGM = RandomResponsesGM[Math.floor(Math.random() * RandomResponsesGM.length)]

        if (messageContent.includes("gm")) {
            // React with a sun emoji
            await message.react('☀️');
            // Answer with a message
            await message.reply(randomResponseGM);
            return; // Optional: return here if you don't want to execute any further commands after responding to a mention
        }


        if (messageContent.includes("gn")) {
            // React with a moon emoji
            await message.react('🌚');
            // Answer with a message
            await message.reply("GN 🌚");
            return; // Optional: return here if you don't want to execute any further commands after responding to a mention
        }

        // Check if the bot is mentioned in the message
        if (message.mentions.users.has(client.user.id)) {
            // Respond to the mention heregm
            await message.reply('Rawwr');
            return; // Optional: return here if you don't want to execute any further commands after responding to a mention
        }

        // Execute other commands if the message is not a bot mention
        await client.executeCommand(message, false);
    }
}
