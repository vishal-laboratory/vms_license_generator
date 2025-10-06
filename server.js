<<<<<<< HEAD
const express = require('express');
const { startBaileys } = require('./whatsapp');
const cors = require('cors'); 

const app = express();
// CRITICAL FIX: Changed port from 9000 to 8001 to match the client-side HTML.
const port = 8001; 

// Global state variables for the current session
let messageQueue = [];
let qrCodeString = null;
let connectionStatus = 'init'; // 'init', 'qr_needed', 'open', 'closed'

// --- Middleware ---
// FIX: Enable CORS to allow the browser (running the HTML file) to connect to this local server.
// Using explicit origins including the new port and the explicit 127.0.0.1 loopback address.
app.use(cors({
    origin: [
        'http://localhost:8001', 'http://127.0.0.1:8001', // New explicit server address
        'http://localhost:8080', 'http://127.0.0.1:8080', // Common development servers
        'http://localhost:5500', 'http://127.0.0.1:5500', // VS Code Live Server
        'null' // File protocol access
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use(express.json());

// --- Baileys Callbacks ---

// Callback to handle incoming messages from the WhatsApp client
const messageHandlerCallback = (messageText) => {
    console.log(`[QUEUE] New message received and added to queue (${messageQueue.length + 1})`);
    messageQueue.push(messageText);
};

// Callback to handle connection status changes (QR, Open, Closed)
const statusHandlerCallback = (status, qrData) => {
    connectionStatus = status;
    if (qrData) {
        qrCodeString = qrData;
        console.log("QR Code received. Check the HTML application.");
    } else if (status === 'open') {
        qrCodeString = null; // Clear QR after successful login
        console.log("Connection OPEN. API operational.");
    }
};

// --- API Endpoints ---

// Endpoint to check the current connection status and retrieve the QR code
app.get('/qr-status', (req, res) => {
    let responseQr = qrCodeString;
    if (connectionStatus === 'open') {
        // Prevent continuous resending of the QR string after login
        responseQr = null; 
    }
    
    // We send back the status and the QR string (if available)
    res.json({
        status: connectionStatus,
        qr: responseQr
    });
});

// Endpoint to retrieve the entire message queue for display.
app.get('/get-queue', (req, res) => {
    res.json({ queue: messageQueue });
});

// Endpoint to remove a message from the queue by its index (0-based).
app.post('/discard-message/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < messageQueue.length) {
        // Use splice to remove the element at the specified index
        messageQueue.splice(index, 1); 
        res.json({ status: 'success', message: 'Message discarded.' });
    } else {
        res.status(400).json({ status: 'error', message: 'Invalid queue index.' });
    }
});

// Start the Baileys client and the Express server
// Use a timeout to ensure the Express server is fully up before Baileys starts trying to connect
// This avoids network contention on startup.
setTimeout(() => {
    startBaileys(messageHandlerCallback, statusHandlerCallback);
}, 1000); // 1 second delay

app.listen(port, () => {
    console.log(`Server running securely on http://127.0.0.1:${port}`);
    console.log('Ensure this IP is running 24/7 for stability.');
});
=======
const express = require('express');
const { startBaileys } = require('./whatsapp');
const cors = require('cors'); 

const app = express();
// CRITICAL FIX: Changed port from 9000 to 8001 to match the client-side HTML.
const port = 8001; 

// Global state variables for the current session
let messageQueue = [];
let qrCodeString = null;
let connectionStatus = 'init'; // 'init', 'qr_needed', 'open', 'closed'

// --- Middleware ---
// FIX: Enable CORS to allow the browser (running the HTML file) to connect to this local server.
// Using explicit origins including the new port and the explicit 127.0.0.1 loopback address.
app.use(cors({
    origin: [
        'http://localhost:8001', 'http://127.0.0.1:8001', // New explicit server address
        'http://localhost:8080', 'http://127.0.0.1:8080', // Common development servers
        'http://localhost:5500', 'http://127.0.0.1:5500', // VS Code Live Server
        'null' // File protocol access
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use(express.json());

// --- Baileys Callbacks ---

// Callback to handle incoming messages from the WhatsApp client
const messageHandlerCallback = (messageText) => {
    console.log(`[QUEUE] New message received and added to queue (${messageQueue.length + 1})`);
    messageQueue.push(messageText);
};

// Callback to handle connection status changes (QR, Open, Closed)
const statusHandlerCallback = (status, qrData) => {
    connectionStatus = status;
    if (qrData) {
        qrCodeString = qrData;
        console.log("QR Code received. Check the HTML application.");
    } else if (status === 'open') {
        qrCodeString = null; // Clear QR after successful login
        console.log("Connection OPEN. API operational.");
    }
};

// --- API Endpoints ---

// Endpoint to check the current connection status and retrieve the QR code
app.get('/qr-status', (req, res) => {
    let responseQr = qrCodeString;
    if (connectionStatus === 'open') {
        // Prevent continuous resending of the QR string after login
        responseQr = null; 
    }
    
    // We send back the status and the QR string (if available)
    res.json({
        status: connectionStatus,
        qr: responseQr
    });
});

// Endpoint to retrieve the entire message queue for display.
app.get('/get-queue', (req, res) => {
    res.json({ queue: messageQueue });
});

// Endpoint to remove a message from the queue by its index (0-based).
app.post('/discard-message/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < messageQueue.length) {
        // Use splice to remove the element at the specified index
        messageQueue.splice(index, 1); 
        res.json({ status: 'success', message: 'Message discarded.' });
    } else {
        res.status(400).json({ status: 'error', message: 'Invalid queue index.' });
    }
});

// Start the Baileys client and the Express server
// Use a timeout to ensure the Express server is fully up before Baileys starts trying to connect
// This avoids network contention on startup.
setTimeout(() => {
    startBaileys(messageHandlerCallback, statusHandlerCallback);
}, 1000); // 1 second delay

app.listen(port, () => {
    console.log(`Server running securely on http://127.0.0.1:${port}`);
    console.log('Ensure this IP is running 24/7 for stability.');
});
>>>>>>> a35a8f3 (Updated index.html and script fixes for QR and WhatsApp login handling)
