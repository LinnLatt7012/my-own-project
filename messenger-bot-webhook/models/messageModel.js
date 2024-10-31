import { PAGE_ACCESS_TOKEN } from '../config.js';

export function logMessage(senderPsid, message) {
    console.log(`Message from ${senderPsid}: ${message.text}`); 
}
// Helper function to fetch the user profile
export async function getUserProfile(senderPsid) {
    try {
        const res = await fetch(`https://graph.facebook.com/${senderPsid}?fields=first_name,last_name&access_token=${PAGE_ACCESS_TOKEN}`);
        if (res.ok) {
            const profile = await res.json();
            return profile;
        } else {
            console.error('Failed to fetch user profile:', res.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}