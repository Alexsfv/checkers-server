import { UserModel } from './user';
import mongoose from 'mongoose'

export interface globalMessageModel extends mongoose.Document {
    created_at: string
    user: string | UserModel
    text: string
}

const globalMessageSchema = new mongoose.Schema({
    created_at: String,
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    text: String
})

export const GlobalMessage = mongoose.model('GlobalMessage', globalMessageSchema)