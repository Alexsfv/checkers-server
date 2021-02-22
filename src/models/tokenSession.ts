import mongoose from 'mongoose';

export interface TokenSessionModel extends mongoose.Document {
    userId: string
    access_token: string
    exp_access: string
    refresh_token: string
    exp_refresh: string
}

const tokenSession = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    access_token: String,
    access_exp: Number,
    refresh_token: String,
    refresh_exp: Number
})

export const TokenSession = mongoose.model('TokenSession', tokenSession)