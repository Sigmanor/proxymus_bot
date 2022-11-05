import {menu, User} from '../../constants.js';
import {getDatabaseValue} from './get.js';

export async function createUser(id) {
    const user = await getDatabaseValue(id);
    if (!user) {
        const user = await User.create({
            id: id,
            ban: '0',
            menuState: menu.main,
            settingsProxyType: '',
            settingsProxyLevel: '',
            settingsProxyLimit: 1,
            settingsProxyFormat: 'message'
        });
        console.log(`Added new user: ${user}`);
    }
}