import { User, UserModel } from '../models/user';
import { TokenSession, TokenSessionModel } from './../models/tokenSession';
import { Tokens } from './../types/token';

export const addTokenSession = async (userId: string, tokens: Tokens): Promise<boolean> => {
    const user = await User.findOne({ _id: userId }) as UserModel
    if (user) {
        const tokenSession = new TokenSession({
            ...tokens,
            userId: user._id
        }) as TokenSessionModel
        await tokenSession.save()
        user.tokenSessions.push(tokenSession)
        await user.save()
        return true
    }
    return false
}