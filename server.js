const express = require('express');
const app = express();
const http = require('http');
const tmi = require('tmi.js');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const client = new tmi.Client({
    options: { debug: true },
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: 'stuck_overflow',
        password: process.env.TWITCH_OAUTH_TOKEN
    },
    channels: ['stuck_overflow']
});
io.of('/goots').on('connection', (socket) => {
    console.log(socket);
});

client.connect();

const commands = ['gootsgo', 'gootsup', 'gootsdown', 'gootsfast', 'gootsslow', 'gootsreset'];
client.on('message', (channel, tags, message, self) => {
    // Ignore echoed messages.
    if (self) return;

    // Parse message to see if it is a command.
    commands.forEach(command => {
        if (message.toLowerCase() === '!' + command) {
            io.of('/goots').emit(command);
        }
    });
});

if (module === require.main) {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
        console.log('Press Ctrl+C to quit.');
    });
}


module.exports = server;
