---
title: "Building a Messenger Bot Webhook with Node.js"
excerpt: "A complete guide to creating a webhook for a Facebook Messenger bot using Node.js and Express, including setup, configuration, and message handling."
publishDate: "October 29, 2024"
tags:
    - Facebook Messenger Bot
    - Node.js
    - Webhooks
    - API Integration
    - Express.js
slug: building-messenger-bot-nodejs
isFeatured: true
seo:
    image:
        src: 'https://www.hostpapa.com/blog/app/uploads/2020/07/chatbot-interaccion-1024x500-1024x500.png'
        alt: "Messenger bot webhook setup illustration"
---


![Building a Messenger Bot Webhook with Node.js](https://www.hostpapa.com/blog/app/uploads/2020/07/chatbot-interaccion-1024x500-1024x500.png "Building a Messenger Bot Webhook with Node.js")

:::main{style="color:red"}
Note!!! Content and assistance provided with the help of ChatGPT, an AI language model by OpenAI.
:::

Setting up a Facebook Messenger bot involves creating a webhook to listen for messages and events from Facebook's servers. This blog will guide you through building a Messenger bot webhook using Node.js and Express, where the bot will respond with a welcome message when a user sends "hi."
## Features

- Verifies the webhook with Facebook's API.
- Handles incoming messages and replies with a welcome message when the user sends "hi".
- Uses `dotenv` for secure environment configuration.

## Prerequisites

- **Node.js** (v14 or newer)
- **Facebook developer account ** (not difficult, you can create one just by going to [Facebook for Developers](https://developers.facebook.com/)) and Facebook App
- **Facebook Page Access Token** (after Connect to Facebook page & generate PAGE_ACCESS_TOKEN if you haven't create oneand **Webhook Verify Token** (it is just random string for encryption)

### Creating Facebook App for Messenger Bot

- Go to Facebook for Developers and log in.
- Click on My Apps > Create App.
- You can just click next on 'Bussiness' section and can select other on 'Usecase' section (this step don't do much)
- Select "Business" as the app type and click Next.
- Enter your App Name, Contact Email, and click Create App ID.
- Add the Messenger Product
    - In your App Dashboard, go to the Add Products to Your App section.
    - Find Messenger and click Set Up.
- Generate a Page Access Token
    - In Messenger Settings, under Access Tokens, click Add or Remove Pages.
    - Select the Facebook Page you want to use with the bot, then click Next and Done to grant permissions.
    - After authorization, select the Page in Access Tokens and click Generate Token. Copy this token and add it to your .env file as PAGE_ACCESS_TOKEN.
---

## Project Setup

### 1. Code Setup
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
PAGE_ACCESS_TOKEN=YOUR_PAGE_ACCESS_TOKEN
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

### 2. Set Up Environment Variables

Create a `.env` file in the project root directory:

```plaintext
# .env
PORT=3000
VERIFY_TOKEN=YOUR_VERIFY_TOKEN         # Your unique verify token for Facebook webhook verification
PAGE_ACCESS_TOKEN=YOUR_PAGE_ACCESS_TOKEN # Your Facebook Page Access Token
```

### 3. Update Facebook Developer Settings

- Go to [Facebook for Developers](https://developers.facebook.com/).
- Go to your Facebook APP.
- In the **Messenger Settings**, add your **Webhook URL** (we can use ngrok or deploy on any platform to get a public URL).
- Add the **Webhook Verify Token** (use the same token as `VERIFY_TOKEN` in your `.env` file).
- Subscribe to the `messages` and `messaging_postbacks` events on page.

### 4. Run the Application

Start the server:`node index.js`

### 5. Test the Webhook on localhost

Visit `http://localhost:3000/webhook?hub.mode=subscribe&hub.challenge=1158201444&hub.verify_token=YOUR_VERIFY_TOKEN` to confirm verification.

### 6. Get Public

you can use ngrok or any deployment service to get public url (will use in Webhook ).

### 7. Set Up the Webhook in Facebook Developer Portal

- Go to your app’s **Messenger settings** on Facebook for Developers.
- Under **Webhooks**, click **Edit Subscription**.
- Enter the endpoint URL you copied in the **Callback URL** field, and use the `VERIFY_TOKEN` you added to `.env` for the **Verify Token**.
- Select the `messages` and `messaging_postbacks` subscriptions.

### 8. Test the Messenger Bot

- Open your Facebook Page and go to **Messenger**.
- Send "hi" to the bot. It should respond with **"Welcome! How can I help you today?"**.
- If you send any other message, it will respond with **"I'm here to help! Send 'hi' for a welcome message."**

---

## Folder Structure Recap
```plaintext
messenger-bot-webhook/
├── controllers/
│   └── messageController.js    # Controller handling requests
├── models/
│   └── messageModel.js         # Model for data handling
├── routes/
│   └── webhookRoute.js         # Route definitions
├── index.js                    # Server entry point
└── config.js                   # Config file loading .env variables
```
With these steps, you've set up a functional Facebook Messenger bot webhook using Node.js and Express. This bot handles incoming messages, verifies webhook requests, and responds to users, providing a scalable starting point for more complex bot features.