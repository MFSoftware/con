import mongoose from 'mongoose';

const User = new mongoose.Schema({
    username: String,
    tfa_enabled: Boolean
}); 

export default mongoose.model('User', User);