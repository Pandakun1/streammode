import WebSocket, { WebSocketServer } from 'ws';
import express from 'express';

const app = express();
const wss = new WebSocketServer({ port: 8080 });

let clients = [];

wss.on('connection', (ws) => {
    clients.push(ws);
    console.log('Viewer connected');

    ws.on('close', () => {
        clients = clients.filter(c => c !== ws);
        console.log('Viewer disconnected');
    });
});

// Endpoint für FiveM (empfängt Bilder)
app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' }));

app.post('/frame', (req, res) => {
if (req.query.token !== 'pandastream') {
        return res.sendStatus(403);
    }

    const buffer = req.body;

    if (!buffer || buffer.length === 0) {
        return res.status(400).send('No data');
    }

    // Broadcast an alle Viewer
    clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(buffer);
        }
    });

    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log('HTTP Server: http://localhost:3000');
    console.log('WebSocket: ws://localhost:8080');
});