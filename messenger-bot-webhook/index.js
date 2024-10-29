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
