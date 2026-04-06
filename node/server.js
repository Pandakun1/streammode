import express from "express";
import { WebSocketServer } from "ws";
import multer from "multer";
import path from "path";

const app = express();
const wss = new WebSocketServer({ port: 8080 });
const upload = multer(); // Speicher-basiert

let clients = [];

// WebSocket Viewer
wss.on("connection", (ws) => {
  clients.push(ws);
  console.log("Viewer connected");

  ws.on("close", () => {
    clients = clients.filter(c => c !== ws);
    console.log("Viewer disconnected");
  });
});

// Serve Viewer HTML
app.use(express.static(path.join(process.cwd())));
app.get("/", (req, res) => res.sendFile(path.join(process.cwd(), "viewer.html")));

// CaptureStream Upload Endpoint
app.post("/:token", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No data");

  const buffer = req.file.buffer;
  // Broadcast WebM chunk an alle Viewer
  clients.forEach(ws => {
    if (ws.readyState === ws.OPEN) ws.send(buffer);
  });

  res.json({ success: true });
});

app.listen(3000, () => {
  console.log("HTTP Server: http://localhost:3000");
  console.log("WebSocket: ws://localhost:8080");
});