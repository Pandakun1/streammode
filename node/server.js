const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const PORT = 3000;
const AUTH_TOKEN = "pandastream";

// 1. Statische Dateien bereitstellen
// Dies erlaubt es, die index.html direkt im Browser aufzurufen
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. Middleware für die FiveM Screenshots
app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '20mb' }));

// 3. Der Endpunkt für FiveM
app.post('/frame', (req, res) => {
    if (req.query.token !== AUTH_TOKEN) {
        return res.status(403).send('Unauthorized');
    }

    const base64Image = req.body.toString('base64');
    io.emit('new-frame', `data:image/webp;base64,${base64Image}`);
    res.status(200).send('OK');
});

io.on('connection', (socket) => {
    console.log('Browser verbunden:', socket.id);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`=========================================`);
    console.log(`SERVER LÄUFT AKTIV`);
    console.log(`Browser-Link: http://localhost:${PORT}`);
    console.log(`FiveM-URL: http://DEINE_IP:${PORT}/frame?token=${AUTH_TOKEN}`);
    console.log(`=========================================`);
});