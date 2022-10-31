import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {RateLimiter} from '@riddea/telegraf-rate-limiter';
import {Telegraf} from 'telegraf';

dotenv.config();
export const menu = {
    main: 'mainMenu',
    settings: 'settingsMenu',
    settings_sub_menu: 'settingsSubMenu',
};

export const rateLimiter = new RateLimiter(1, 1000);
export const bot = new Telegraf(process.env.BOT_TOKEN);
console.log(process.env.BOT_TOKEN);

export const User = mongoose.model('User');