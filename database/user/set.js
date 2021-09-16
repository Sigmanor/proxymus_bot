import {User} from '../../constants.js';

export async function setDatabaseValue(ctx, field, value) {
    User.findOne({id: ctx.message.chat.id}, function (err, user) {
        user[field] = value;
        user.save(function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
}