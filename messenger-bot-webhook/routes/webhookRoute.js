// routes/webhookRoute.js
import express from 'express';
import { verifyWebhook, handleWebhookEvent } from '../controllers/messageController.js';

const router = express.Router();

router.get('/webhook', verifyWebhook);   // Webhook verification
router.post('/webhook', handleWebhookEvent);  // Webhook event handler

export default router;
