import {User} from '../../constants.js';

export async function getDatabaseValue(id) {
    return User.findOne({id});
}