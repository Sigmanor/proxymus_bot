import {Markup} from 'telegraf';

export const mainKeyboard = Markup.keyboard([
    ['⚙ Settings', '🌐 Get proxy'],

]).resize();

export const settingsKeyboard = Markup.keyboard([
    ['Type', 'Level', 'Limit', 'Format'],
    ['⬅ Back']
]).resize();

export const proxyCountKeyboard = Markup.keyboard([
    ['📝 Edit'],
    ['↩ Main menu', '⬅ Back']
]).resize();

export let proxyTypeKeyboard = Markup.keyboard([
    ['socks4', 'socks5', 'http', 'https'],
    ['↩ Main menu', '⬅ Back']
]).resize();

export let proxyLevelKeyboard = Markup.keyboard([
    ['transparent', 'anonymous', 'elite'],
    ['↩ Main menu', '⬅ Back']
]).resize();

export let proxyFormatKeyboard = Markup.keyboard([
    ['message', 'text file'],
    ['↩ Main menu', '⬅ Back']
]).resize();