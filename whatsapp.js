<<<<<<< HEAD
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');

// --- CRITICAL CONFIGURATION ---
const TARGET_GROUP_JID = 'YOUR_WHATSAPP_GROUP_JID_HERE'; // <--- MUST BE EDITED
// ------------------------------

const startBaileys = async (messageHandlerCallback, statusHandlerCallback) => {
    // Create/load the folder 'auth_info_baileys' for login session
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        // printQRInTerminal: true is deprecated, QR handling is done via the update event
        browser: ['VMS-License-Bot', 'Safari', '1.0']
    });

    // Connection updates
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('SCAN THIS QR CODE TO LOG IN:');
            console.log('----------------------------------------------------');
            console.log(qr);
            console.log('----------------------------------------------------');
            console.log('Use a QR code scanner app on your phone to read the text above, or paste the text into an online QR generator.');
            
            // CRITICAL FIX: Send the 'qr_needed' status AND the QR string to the server
            statusHandlerCallback('qr_needed', qr); 
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('Connection closed. Attempting reconnect...');
                statusHandlerCallback('closed', null); // Notify server of closed connection
                startBaileys(messageHandlerCallback, statusHandlerCallback);
            } else {
                console.log('Logged out. Delete auth_info_baileys and restart to log in again.');
                statusHandlerCallback('logged_out', null); // Notify server of logout
            }
        } else if (connection === 'open') {
            console.log('WhatsApp connection opened and running!');
            statusHandlerCallback('open', null); // Notify server of open connection
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // Message handling
    sock.ev.on('messages.upsert', async (m) => {
        // Iterate through all incoming messages in the update object (m.messages)
        for (const msg of m.messages) {
            // Ignore own messages or empty messages
           // if (msg.key.fromMe || !msg.message) continue;
    
            const remoteJid = msg.key.remoteJid;
    
            // Check if it's a group message and log the JID
            if (remoteJid && remoteJid.endsWith('@g.us')) {
                // --- TEMPORARY LOGGING FOR GROUP ID FINDING ---
                // Send a test message in the group and look for the output in your terminal.
                console.log('----------------------------------------------------');
                console.log('Group Message Received! JID:', remoteJid);
                console.log('Group Name (If available in cache):', sock.groupMetadata ? sock.groupMetadata(remoteJid)?.subject : 'N/A');
                console.log('----------------------------------------------------');
                // --- END TEMPORARY LOGGING ---

            }
    
    
            // Only process messages from the target group
            // NOTE: remoteJid needs to be the JID of the group, e.g., '1234567890-123456@g.us'
            if (remoteJid !== TARGET_GROUP_JID) continue;
    
            const messageText = msg.message.extendedTextMessage?.text || msg.message.conversation || '';
    
            // Only process messages that look like license requests
            if (messageText.includes('Police Station Name') && messageText.includes('machine key')) {
                messageHandlerCallback(messageText.trim()); // Send to queue
            }
        }
    });
};

module.exports = { startBaileys };
=======

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');

// --- CRITICAL CONFIGURATION ---
const TARGET_GROUP_JID = '120363401412749291@g.us'; 
// ------------------------------

const startBaileys = async (messageHandlerCallback, statusHandlerCallback) => {
    // Create/load the folder 'auth_info_baileys' for login session
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        // printQRInTerminal: true is deprecated, QR handling is done via the update event
        browser: ['VMS-License-Bot', 'Safari', '1.0']
    });

    // Connection updates
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('SCAN THIS QR CODE TO LOG IN:');
            console.log('----------------------------------------------------');
            console.log(qr);
            console.log('----------------------------------------------------');
            console.log('Use a QR code scanner app on your phone to read the text above, or paste the text into an online QR generator.');
            
            // CRITICAL FIX: Send the 'qr_needed' status AND the QR string to the server
            statusHandlerCallback('qr_needed', qr); 
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('Connection closed. Attempting reconnect...');
                statusHandlerCallback('closed', null); // Notify server of closed connection
                startBaileys(messageHandlerCallback, statusHandlerCallback);
            } else {
                console.log('Logged out. Delete auth_info_baileys and restart to log in again.');
                statusHandlerCallback('logged_out', null); // Notify server of logout
            }
        } else if (connection === 'open') {
            console.log('WhatsApp connection opened and running!');
            statusHandlerCallback('open', null); // Notify server of open connection
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // Message handling
    sock.ev.on('messages.upsert', async (m) => {
        // Iterate through all incoming messages in the update object (m.messages)
        for (const msg of m.messages) {
            // Ignore own messages or empty messages
           // if (msg.key.fromMe || !msg.message) continue;
    
            const remoteJid = msg.key.remoteJid;
    
            // Check if it's a group message and log the JID
            if (remoteJid && remoteJid.endsWith('@g.us')) {
                // --- TEMPORARY LOGGING FOR GROUP ID FINDING ---
                // Send a test message in the group and look for the output in your terminal.
                console.log('----------------------------------------------------');
                console.log('Group Message Received! JID:', remoteJid);
                console.log('Group Name (If available in cache):', sock.groupMetadata ? sock.groupMetadata(remoteJid)?.subject : 'N/A');
                console.log('----------------------------------------------------');
                // --- END TEMPORARY LOGGING ---

            }
    
    
            // Only process messages from the target group
            // NOTE: remoteJid needs to be the JID of the group, e.g., '1234567890-123456@g.us'
            if (remoteJid !== TARGET_GROUP_JID) continue;
    
            const messageText = msg.message.extendedTextMessage?.text || msg.message.conversation || '';
    
            // Only process messages that look like license requests
            if (messageText.includes('Police Station Name') && messageText.includes('machine key')) {
                messageHandlerCallback(messageText.trim()); // Send to queue
            }
        }
    });
};

module.exports = { startBaileys };
>>>>>>> a35a8f3 (Updated index.html and script fixes for QR and WhatsApp login handling)
