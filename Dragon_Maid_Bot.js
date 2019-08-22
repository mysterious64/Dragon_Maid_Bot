const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");

client.on('ready', () => {
    console.log("Authur is: " + config.owner);
    console.log("Connected as " + client.user.tag);
    // List servers the bot is connected to
    console.log("Servers:");
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name);

        // List all channels
        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
        });
    });
    // Set bot status to: "Playing with JavaScript"
    client.user.setActivity("Master", {type: "LISTENING"});

    // Alternatively, you can set the activity to any of the following:
    // PLAYING, STREAMING, LISTENING, WATCHING
    // For example:
    // client.user.setActivity("TV", {type: "WATCHING"})
});

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
        return;
    }
    
    if (receivedMessage.content.startsWith(config.prefix)) {
        processCommand(receivedMessage);
    }
});

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1); // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand);
    console.log("Arguments: " + arguments); // There may not be any arguments

    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage);
    } else if (primaryCommand == "multiply") {
        multiplyCommand(arguments, receivedMessage);
    } else if (primaryCommand == "punch") {
        punchCommand(arguments, receivedMessage);
    } else {
        receivedMessage.channel.send("I don't understand the command. Try `!help` or `!multiply`");
    }
}

function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 0) {
        receivedMessage.channel.send("It looks like you might need help with " + arguments);
    } else {
        receivedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]`");
    }
}

function multiplyCommand(arguments, receivedMessage) {
    if (arguments.length < 2) {
        receivedMessage.channel.send("Not enough values to multiply. Try `!multiply 2 4 10` or `!multiply 5.2 7`");
        return;
    }
    let product = 1;
    arguments.forEach((value) => {
        product = product * parseFloat(value);
    });
    receivedMessage.channel.send("The product of " + arguments + " multiplied together is: " + product.toString());
}

function punchCommand(arguements, receivedMessage) {
    let member = receivedMessage.mentions.members.first();
    console.log('Member is: ' + member.id);
    if (!member) {
        receivedMessage.channel.send('I need someone to hit first!');
    } else if (member.id === config.owner || member.id === client.user.id) {
        receivedMessage.channel.send('The maid hurt itself in confusion');
    } else {
        receivedMessage.channel.send(':right_facing_fist: ' + member);
    }
}


// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
// Create file call config.json containing the following:
// { "secret_key": "xxxxxxxxx", "prefix": "!" }
// Replace xxxxxxxxx with the secret key

client.login(config.secret_key);