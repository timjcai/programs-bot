
const fs = require('fs');
require('dotenv').config();

const { Client, GatewayIntentBits} = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });


// const Discord = require('discord.js')
// const client = new Discord.Client();


// client.prefix = '!'
// client.commands = new Discord.Collection();

async function sendMessages() {
    setInterval(() => {
        fs.readFile('data.json', 'utf8', (err, data) => {
            if (err) throw err;

            let messages = JSON.parse(data);
            let hasChanges = false;

            for (const [timestamp, content] of Object.entries(messages)) {
                if (!content.checked) {
                    const messageTime = new Date(timestamp);

                    // Check if the message's time has passed
                    if (messageTime <= new Date()) {
                        const channel = client.channels.cache.get('1272339510533034097');
                        if (channel) {
                            channel.send(content.message);

                            // Mark the message as checked
                            content.checked = true;
                            hasChanges = true;
                        }
                    }
                }
            }

            // Write back the updated data if there were changes
            if (hasChanges) {
                fs.writeFile('data.json', JSON.stringify(messages, null, 4), 'utf8', (err) => {
                    if (err) throw err;
                });
            }
        });
    }, 60000); // Check every minute
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    sendMessages();
});

client.login(process.env.TOKEN);