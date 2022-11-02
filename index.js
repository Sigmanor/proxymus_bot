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

commands();

bot.launch({dropPendingUpdates: true})
    .then(() => console.log(`${new Date()} It\'s Alive!`))
    .catch(function (error) {
        console.log(error);
    });

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
