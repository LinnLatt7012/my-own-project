import { logMessage } from '../models/messageModel.js';
import { VERIFY_TOKEN,PAGE_ACCESS } from '../config.js';
async function sendTextMessage(senderPsid, response) {
    const requestBody = {
        recipient: {
            id: senderPsid,
        },
        message: {
            text: response,
        },
    };

    try {
        const res = await fetch(`https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
            console.error('Failed to send message:', res.statusText);
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Handle incoming messages
export function handleIncomingMessage(senderPsid, message) {
    logMessage(senderPsid, message);

    // Check if the message text is "hi" (case insensitive)
    if (message.text && message.text.toLowerCase() === 'hi') {
        sendTextMessage(senderPsid, "Welcome! How can I help you today?");
    } else {
        sendTextMessage(senderPsid, "I'm here to help! Send 'hi' for a welcome message.");
    }
}

// Verify webhook
export function verifyWebhook(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
}

// Handle webhook events
export function handleWebhookEvent(req, res) {
    const body = req.body;

    if (body.object === 'page') {
        body.entry.forEach(entry => {
            const webhookEvent = entry.messaging[0];
            const senderPsid = webhookEvent.sender.id;

            if (webhookEvent.message) {
                handleIncomingMessage(senderPsid, webhookEvent.message);
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
}