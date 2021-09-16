import {User} from '../../constants.js';

export function updateDatabaseValue(ctx, field, value, action) {
    return User.findOne({id: ctx.message.chat.id}, function (err, user) {
        if (action === 'assign') {
            user[field] += value;
        }
        if (action === 'replace') {
            user[field] = user[field].replace(value, '');
        }
        user.save(function (err) {
            if (err) {
                console.error(err);
            }
        });
    });

}