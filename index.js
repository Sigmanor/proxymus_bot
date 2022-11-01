import dotenv from 'dotenv';
import './models/User.js';
import mongoose from 'mongoose';
import {bot} from './constants.js';
import commands from './bot/commands.js';
import ngrok from 'ngrok'

dotenv.config();

mongoose.connect(process.env.MONGO)
    .then(() => console.log('Mongoose connection open to ' + process.env.MONGO))
    .catch(function (error) {
        console.log(error);
    });

(async function () {
    commands();
    const url = await ngrok.connect({
        addr: 3000,
        authtoken: process.env.NGROK,
        region: 'eu',
    });
    console.log(`tunnel: ${url}`);
    await bot.launch({
        dropPendingUpdates: true,
        webhook: {
            domain: url,
            port: 3000,
        },
    });
    console.log(`Bot successfully started ^_^`);
})();
//test

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
