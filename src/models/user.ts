import { TokenSessionModel } from './tokenSession';
import mongoose from "mongoose";


export interface UserModel extends mongoose.Document {
    email: string
    password: string
    nickName: string
    roles: string[]
    tokenSessions: TokenSessionModel[]
    image: string
}

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    nickName: String,
    image: String,
    roles: [String],
    tokenSessions: [{
        type: mongoose.Types.ObjectId,
        ref: 'TokenSession'
    }]
})

export const User = mongoose.model('User', userSchema)