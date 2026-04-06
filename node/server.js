import express from 'express';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const wss = new WebSocketServer({ port: 8080 });

let clients = [];

wss.on('connection', ws => {
    clients.push(ws);
    console.log('Viewer connected');
    ws.on('close', () => {
        clients = clients.filter(c => c !== ws);
        console.log('Viewer disconnected');
    });
});

// Static Viewer
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'viewer.html')));

// raw body für Blob
app.use(express.raw({ type: 'application/octet-stream', limit: '50mb' }));

// Frame Upload Endpoint
app.post('/frame', (req, res) => {
    const buffer = req.body;
    if (!buffer || buffer.length === 0) {
        console.log('No data received');
        return res.status(400).send('No data');
    }

    // Broadcast an alle Viewer
    clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) ws.send(buffer);
    });

    res.json({ success: true });
});

app.listen(3000, () => console.log('HTTP Server: http://localhost:3000\nWebSocket: ws://localhost:8080'));