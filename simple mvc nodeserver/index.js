// index.js
import express from 'express';
import bodyParser from 'body-parser';
import { PORT } from './config.js';

const app = express();
app.use(bodyParser.json());

// route handle here
app.use('/', 'route handler here');

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
