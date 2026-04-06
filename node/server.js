const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const multer = require('multer'); // Neu hinzugefügt
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const upload = multer(); // Speicher-Handler für Dateidaten

const PORT = 3000;
const AUTH_TOKEN = "pandastream";

app.use(express.static(__dirname));

// Die Resource 'screencapture' sendet das Bild meistens im Feld 'file'
app.post('/frame', upload.single('file'), (req, res) => {
    if (req.query.token !== AUTH_TOKEN) return res.status(403).json({error: 'Auth'});

    // Wir prüfen, ob 'multer' eine Datei extrahiert hat
    let imageBuffer = null;
    
    if (req.file && req.file.buffer) {
        imageBuffer = req.file.buffer; // Der saubere Bild-Inhalt
    } else if (req.body && Buffer.isBuffer(req.body)) {
        imageBuffer = req.body; // Fallback, falls es doch Rohdaten sind
    }

    if (!imageBuffer || imageBuffer.length < 100) {
        return res.status(400).json({ error: 'No image data found' });
    }

    // Sende nur den sauberen Buffer an die Browser
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(imageBuffer);
        }
    });

    res.status(200).json({ success: true });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`=========================================`);
    console.log(`STREAM SERVER GESTARTET`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`=========================================`);
});