// config.js
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// config.js
export const PORT = process.env.PORT || 3000;
export const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "YOUR_VERIFY_TOKEN";
export const PAGE_ACCESS_TOKEN= process.env.PAGE_ACCESS_TOKEN  || "YOUR_PAGE_TOKEN";
