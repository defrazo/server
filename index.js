const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const corsMiddleware = require('./middleware/cors.middleware');
const authRouter = require('./router/auth.routes');
const textRouter = require('./router/text.routes');

const app = express();
const PORT = config.get('serverPort');

app.use(corsMiddleware);
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/save', textRouter);

const start = async () => {
    try {
        await mongoose.connect(config.get('dbURL'));
        app.listen(PORT, () => {
            console.log('Server started on port ', PORT);
        });
    } catch (e) {
        console.error('Server start error:', e.message);
        process.exit(1);
    }
};

start();