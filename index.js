import dotenv from 'dotenv';
import './models/User.js';
import mongoose from 'mongoose';
import {bot} from './constants.js';
import commands from './bot/commands.js';

dotenv.config();

mongoose.connect(process.env.MONGO)
    .then(() => console.log('Mongoose connection open to ' + process.env.MONGO))
    .catch(function (error) {
        console.log(error);
    });
    
console.log(process.env.MONGO);   

commands();

(async function () {
    const url = await ngrok.connect({
        addr: 9997,
        authtoken: process.env.NGROK,
        region: 'eu',
    });
    console.log(`tunnel: ${url.magenta}`);
    await bot.launch({
        dropPendingUpdates: true,
        webhook: {
            domain: url,
            port: 9997,
        },
    });
    console.log(
        `\n${dateFormat(new Date(), '[dd.mm.yyyy HH:MM:ss]').blue
        } Bot successfully started ^_^\n`
    );
})();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

//test