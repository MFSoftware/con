import mongoose from 'mongoose';

const Token = new mongoose.Schema({
    user: String,
    text: String
});

export default mongoose.model('Token', Token);