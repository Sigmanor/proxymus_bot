import {updateDatabaseValue} from '../database/user/update.js';
import {proxyFormatKeyboard, proxyLevelKeyboard, proxyTypeKeyboard} from './keyboards.js';

export function changeSettings(ctx, index, keyboard, dbField, value) {
    if (!keyboard.reply_markup.keyboard[0][index].includes('✅ ')) {
        keyboard.reply_markup.keyboard[0].splice(index, 1, `✅ ${value}`);
        updateDatabaseValue(ctx, dbField, `${value},`, 'assign');
    } else {
        keyboard.reply_markup.keyboard[0].splice(index, 1, value);
        updateDatabaseValue(ctx, dbField, `${value},`, 'replace');
    }
}

export function loadSettings(dbValue) {
    proxyTypeKeyboard.reply_markup.keyboard[0] = [
        `${dbValue.settingsProxyType.includes('socks4,') ? '✅ socks4' : 'socks4'}`,
        `${dbValue.settingsProxyType.includes('socks5,') ? '✅ socks5' : 'socks5'}`,
        `${dbValue.settingsProxyType.includes('http,') ? '✅ http' : 'http'}`,
        `${dbValue.settingsProxyType.includes('https,') ? '✅ https' : 'https'}`,
    ];
    proxyLevelKeyboard.reply_markup.keyboard[0] = [
        `${dbValue.settingsProxyLevel.includes('transparent,') ? '✅ transparent' : 'transparent'}`,
        `${dbValue.settingsProxyLevel.includes('anonymous,') ? '✅ anonymous' : 'anonymous'}`,
        `${dbValue.settingsProxyLevel.includes('elite,') ? '✅ elite' : 'elite'}`
    ];
    proxyFormatKeyboard.reply_markup.keyboard[0] = [
        `${dbValue.settingsProxyFormat === 'message' ? '✅ message' : 'message'}`,
        `${dbValue.settingsProxyFormat === 'text file' ? '✅ text file' : 'text file'}`
    ];
}