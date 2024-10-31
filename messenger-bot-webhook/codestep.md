#### 1. Initialize the Project and Install Dependencies
Set up your Node.js project and install the necessary packages:
```bash
mkdir messenger-bot-webhook
cd messenger-bot-webhook
npm init -y
npm install express body-parser dotenv
``` 
 - Enable ES Modules
    In your package.json, add the "type": "module" field. This tells Node.js to interpret .js files as ES Modules.
```json
    {
"name": "messenger-bot-webhook",
"version": "1.0.0",
"main": "index.js",
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
},
"type": "module",
"keywords": [],
"author": "",
"license": "ISC",
"description": "",
"dependencies": {
    "body-parser": "^1.20.3",
    "dotenv": "^16.4.5",
    "express": "^4.21.1"
}
}
```
#### 2. Configuration (config.js && env)
Define your environment settings, such as the port and Facebook verification token:

```bash
// .env
VERIFY_TOKEN=YOUR_VERIFY_TOKEN
PAGE_ACCESS_TOKEN=YOUR_VERIFY_TOKEN
```
```javascript
// config.js
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// config.js
export const PORT = process.env.PORT || 3000;
export const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "YOUR_VERIFY_TOKEN";
export const PAGE_ACCESS_TOKEN= process.env.PAGE_ACCESS_TOKEN  || "YOUR_VERIFY_TOKEN";
```
#### 3. Model (models/messageModel.js)
Define a model to manage data handling or utility functions. In this case, our model will handle logging messages:

```javascript
// models/messageModel.js
export function logMessage(senderPsid, message) {
    console.log(`Message from ${senderPsid}: ${message.text}`);
}
```
#### 4. Controller (controllers/messageController.js)
The controller contains the logic for processing incoming webhook events. It calls functions in the model to log messages or handle other business logic.

```javascript
// controllers/messageController.js
import { logMessage } from '../models/messageModel.js';
import { PAGE_ACCESS_TOKEN } from '../config.js';
import fetch from 'node-fetch'; // Native fetch module from Node.js 18+, or install 'node-fetch' for Node.js < 18

// Helper function to send a message using the Send API
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
        const res = await fetch(`https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
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
        if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
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

```
#### 5. Routes (routes/webhookRoute.js)
Set up the routing for the webhook with the Express router. Routes will link to the corresponding controller functions:

```javascript
// routes/webhookRoute.js
import express from 'express';
import { verifyWebhook, handleWebhookEvent } from '../controllers/messageController.js';

const router = express.Router();

router.get('/webhook', verifyWebhook);   // Webhook verification
router.post('/webhook', handleWebhookEvent);  // Webhook event handler

export default router;
```

#### 6. Entry Point (index.js)
Set up the Express app, configure middleware, and use the routes. This file initializes the server and loads all components.

```javascript
// index.js
import express from 'express';
import bodyParser from 'body-parser';
import { PORT } from './config.js';
import webhookRoute from './routes/webhookRoute.js';

const app = express();
app.use(bodyParser.json());

// Use the webhook route
app.use('/', webhookRoute);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
```
#### 7. Running the Server
Start the server using:

```bash
node index.js
```

