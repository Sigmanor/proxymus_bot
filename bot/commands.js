import {bot, menu, rateLimiter} from '../constants.js';
import {
    mainKeyboard,
    proxyCountKeyboard,
    proxyFormatKeyboard,
    proxyLevelKeyboard,
    proxyTypeKeyboard,
    settingsKeyboard
} from './keyboards.js';
import {createUser} from '../database/user/create.js';
import {setDatabaseValue} from '../database/user/set.js';
import {getDatabaseValue} from '../database/user/get.js';
import {changeSettings, loadSettings} from './settings.js';
import fetch from 'node-fetch';
import StatelessQuestion from 'telegraf-stateless-question';
import {Telegraf} from 'telegraf';

const proxyCountQuestion = new StatelessQuestion('count', async (ctx) => {
    let regex = /^([1-9]|1[0-9]|2[0])$/g; //match numbers from 1 to 20
    if (ctx.message.text.match(regex)) {
        await ctx.replyWithHTML(`Successfully changed to: <b>${ctx.message.text}</b>`, proxyCountKeyboard);
        await setDatabaseValue(ctx, 'settingsProxyLimit', ctx.message.text);
    } else {
        await ctx.replyWithHTML('Valid only numbers from <b>1 to 20</b>.', proxyCountKeyboard);
    }
});
bot.use(Telegraf.log(), proxyCountQuestion.middleware());

/***** COMMANDS *****/
export default function start() {
    bot.start(async (ctx) => {
        await ctx.reply('Main menu', mainKeyboard);
        await createUser(ctx.message.chat.id);
        await setDatabaseValue(ctx, 'menuState', menu.main);
    });
}
/***** COMMANDS *****/


/***** HEARS *****/
bot.hears('🌐 Get proxy', async (ctx) => {
    await ctx.reply('Loading...');
    const user = await getDatabaseValue(ctx.message.chat.id);
    if (user === null) {
        return;
    }

    const limited = rateLimiter.take(ctx.from.id);
    if (limited) {
        return await ctx.telegram.editMessageText(
            ctx.message.chat.id,
            ++ctx.message.message_id,
            null,
            'Wow, you\'re so fast! Wait 5 second before get the new proxies.')
            .catch(function (error) {
                console.log(error);
            });
    }

    const response = await fetch(
        `https://www.proxyscan.io/api/proxy?format=txt&level=${user['settingsProxyLevel']}&type=${user['settingsProxyType']}&limit=${user['settingsProxyLimit']}&ping=499`,
        {
            method: 'POST',
        }
    );

    const data = await response.text();
    if (data.length === 0) {
        return await ctx.telegram.editMessageText(
            ctx.message.chat.id,
            ++ctx.message.message_id,
            null,
            'Proxy not found, try again later or change settings.')
            .catch(function (error) {
                console.log(error);
            });
    }

    if (user['settingsProxyFormat'] === 'text file') {
        await ctx.deleteMessage(++ctx.message.message_id)
            .catch(function (error) {
                console.log(error);
            });
        const buffer = Buffer.from(data, 'utf8');
        return await ctx.replyWithDocument({source: buffer, filename: 'proxy.txt',})
            .catch(function (error) {
                console.log(error);
            });
    }

    let proxyArray = data.toString().split('\n').filter((item) => item);
    let proxies = '';
    for (let i = 0; i < user['settingsProxyLimit']; i++) {
        if (proxyArray[i] === undefined || proxyArray[i] === '') {
            break;
        }
        proxies += '<pre>' + proxyArray[i] + '</pre>' + '\n\n';
    }

    await ctx.telegram.editMessageText(
        ctx.message.chat.id,
        ++ctx.message.message_id,
        null,
        proxies, {
            parse_mode: 'HTML',
        }).catch(function (error) {
        console.log(error);
    });
});

bot.hears('Limit', async (ctx) => {
    const dbValue = await getDatabaseValue(ctx.message.chat.id);
    if (dbValue !== null && dbValue['menuState'] === menu.settings) {
        const dbValue = await getDatabaseValue(ctx.message.chat.id);
        await ctx.replyWithHTML(`Current limit: <b>${dbValue['settingsProxyLimit']}</b>`, proxyCountKeyboard);
        await setDatabaseValue(ctx, 'menuState', menu.settings_sub_menu);
    }
});

bot.hears('Format', async (ctx) => {
    const dbValue = await getDatabaseValue(ctx.message.chat.id);
    if (dbValue !== null && dbValue['menuState'] === menu.settings) {
        const dbValue = await getDatabaseValue(ctx.message.chat.id);
        await loadSettings(dbValue);
        await ctx.reply('Select proxy output format.', proxyFormatKeyboard);
        await setDatabaseValue(ctx, 'menuState', menu.settings_sub_menu);
    }
});

bot.hears('📝 Edit', async (ctx) => {
    const dbValue = await getDatabaseValue(ctx.message.chat.id);
    if (dbValue !== null && dbValue['menuState'] === menu.settings_sub_menu) {
        await ctx.replyWithMarkdown('Send me number from 1 to 20' + proxyCountQuestion.messageSuffixMarkdown(),
            {
                parse_mode: 'Markdown',
                reply_markup: {force_reply: true},
            }
        );
    }
});

bot.hears('Type', async (ctx) => {
    const dbValue = await getDatabaseValue(ctx.message.chat.id);
    if (dbValue !== null && dbValue['menuState'] === menu.settings) {
        await loadSettings(dbValue);
        await ctx.reply('Select proxy type', proxyTypeKeyboard);
    }
    await setDatabaseValue(ctx, 'menuState', menu.settings_sub_menu);
});

bot.hears('Level', async (ctx) => {
    const dbValue = await getDatabaseValue(ctx.message.chat.id);
    if (dbValue !== null && dbValue['menuState'] === menu.settings) {
        await loadSettings(dbValue);
        await ctx.reply('Select proxy level', proxyLevelKeyboard);
    }
    await setDatabaseValue(ctx, 'menuState', menu.settings_sub_menu);
});


bot.hears('⬅ Back', async (ctx) => {
    const dbValue = await getDatabaseValue(ctx.message.chat.id);
    if (dbValue !== null && dbValue['menuState'] === menu.settings_sub_menu) {
        await ctx.reply('Settings', settingsKeyboard);
        await setDatabaseValue(ctx, 'menuState', menu.settings);
    } else {
        await ctx.reply('Main menu', mainKeyboard);
        await setDatabaseValue(ctx, 'menuState', menu.main);
    }
});

bot.hears('↩ Main menu', async (ctx) => {
    const dbValue = await getDatabaseValue(ctx.message.chat.id);
    if (dbValue !== null && dbValue['menuState'] === menu.settings_sub_menu) {
        ctx.reply('Main menu', mainKeyboard);
        await setDatabaseValue(ctx, 'menuState', menu.main);
    }
});

bot.hears('⚙ Settings', async (ctx) => {
    const dbValue = await getDatabaseValue(ctx.message.chat.id);
    if (dbValue !== null && dbValue['menuState'] === menu.main) {
        await ctx.reply('Settings', settingsKeyboard);
        await setDatabaseValue(ctx, 'menuState', menu.settings);
    }
});
/***** HEARS *****/


/***** TEXT *****/
bot.on('text', async (ctx) => {
    const dbValue = await getDatabaseValue(ctx.message.chat.id);
    if (dbValue !== null && dbValue['menuState'] === menu.settings_sub_menu) {
        if (ctx.message.text === 'transparent' || ctx.message.text === '✅ transparent') {
            await loadSettings(await getDatabaseValue(ctx.message.chat.id));
            await changeSettings(ctx, 0, proxyLevelKeyboard, 'settingsProxyLevel', 'transparent');
            await ctx.reply('Settings successfully saved.', proxyLevelKeyboard);
        }

        if (ctx.message.text === 'anonymous' || ctx.message.text === '✅ anonymous') {
            await loadSettings(await getDatabaseValue(ctx.message.chat.id));
            await changeSettings(ctx, 1, proxyLevelKeyboard, 'settingsProxyLevel', 'anonymous');
            await ctx.reply('Settings successfully saved.', proxyLevelKeyboard);
        }

        if (ctx.message.text === 'elite' || ctx.message.text === '✅ elite') {
            await loadSettings(await getDatabaseValue(ctx.message.chat.id));
            await changeSettings(ctx, 2, proxyLevelKeyboard, 'settingsProxyLevel', 'elite');
            await ctx.reply('Settings successfully saved.', proxyLevelKeyboard);
        }

        if (ctx.message.text === 'socks4' || ctx.message.text === '✅ socks4') {
            await loadSettings(await getDatabaseValue(ctx.message.chat.id));
            await changeSettings(ctx, 0, proxyTypeKeyboard, 'settingsProxyType', 'socks4');
            await ctx.reply('Settings successfully saved.', proxyTypeKeyboard);
        }

        if (ctx.message.text === 'socks5' || ctx.message.text === '✅ socks5') {
            await loadSettings(await getDatabaseValue(ctx.message.chat.id));
            await changeSettings(ctx, 1, proxyTypeKeyboard, 'settingsProxyType', 'socks5');
            await ctx.reply('Successfully saved.', proxyTypeKeyboard);
        }

        if (ctx.message.text === 'http' || ctx.message.text === '✅ http') {
            await loadSettings(await getDatabaseValue(ctx.message.chat.id));
            await changeSettings(ctx, 2, proxyTypeKeyboard, 'settingsProxyType', 'http');
            await ctx.reply('Settings successfully saved.', proxyTypeKeyboard);
        }

        if (ctx.message.text === 'https' || ctx.message.text === '✅ https') {
            await loadSettings(await getDatabaseValue(ctx.message.chat.id));
            await changeSettings(ctx, 3, proxyTypeKeyboard, 'settingsProxyType', 'https');
            await ctx.reply('Settings successfully saved.', proxyTypeKeyboard);
        }

        if (ctx.message.text === 'message') {
            proxyFormatKeyboard.reply_markup.keyboard[0].splice(0, 1, '✅ message');
            proxyFormatKeyboard.reply_markup.keyboard[0].splice(1, 1, 'text file');
            await ctx.reply('Settings successfully saved.', proxyFormatKeyboard);
            await setDatabaseValue(ctx, 'settingsProxyFormat', 'message');
        }

        if (ctx.message.text === 'text file') {
            proxyFormatKeyboard.reply_markup.keyboard[0].splice(0, 1, 'message');
            proxyFormatKeyboard.reply_markup.keyboard[0].splice(1, 1, '✅ text file');
            await ctx.reply('Settings successfully saved.', proxyFormatKeyboard);
            await setDatabaseValue(ctx, 'settingsProxyFormat', 'text file');
        }
    }
});
/***** TEXT *****/