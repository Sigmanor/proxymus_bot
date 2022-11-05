import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    id: Number,
    menuState: String,
    requestLimit: Number,
    settingsProxyType: String,
    settingsProxyLevel: String,
    settingsProxyLimit: Number,
    settingsProxyFormat: String
});
mongoose.model('User', UserSchema);
