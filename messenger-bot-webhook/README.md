# Messenger Bot Webhook

This project is a basic Node.js application that handles a webhook for a Facebook Messenger bot. It is designed using the MVC structure and replies with a welcome message when a user sends "hi". 

## Features

- Verifies the webhook with Facebook's API.
- Handles incoming messages and replies with a welcome message when the user sends "hi".
- Uses `dotenv` for secure environment configuration.

## Prerequisites

- **Node.js** (v14 or newer)
- **Fackbook developer account ** (not difficult, you can create one just by going to [Facebook for Developers](https://developers.facebook.com/)) and Facebook App
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

### 1. Install Dependencies

Install required dependencies:

```bash
npm install
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

Start the server:

```bash
node index.js
```

### 5. Test the Webhook on localhost

you can visit to http:\\localhost:<YOUR_PORT>\webhook?hub.mode=subscribe&hub.challenge=1158201444&hub.verify_token=YOUR_VERIFY_TOKEN

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

## Folder Structure

```plaintext
messenger-bot-webhook/
├── controllers/
│   └── messageController.js    # Controller managing request handling logic
├── models/
│   └── messageModel.js         # Model for data handling and logging
├── routes/
│   └── webhookRoute.js         # Route definitions for incoming requests
├── views/
│   └── webhookView.js          # Optional, for view logic if needed
├── index.js                    # Entry point for the server
└── config.js                   # Configuration file loading dotenv variables
```

## Code Explanation

- **`config.js`**: Loads environment variables and exports them for use throughout the app.
- **`controllers/messageController.js`**: Contains logic for handling incoming messages and verifying the webhook.
- **`models/messageModel.js`**: Provides utility functions, such as logging received messages.
- **`routes/webhookRoute.js`**: Defines webhook routes and links them to controller methods.
- **`index.js`**: Main entry point to start the Express server and use the defined routes.


By following this README, you should be able to set up and run the Messenger bot webhook project