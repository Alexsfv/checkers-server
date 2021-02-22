import { decodeBase64 } from './../utils/utils';
import { RefreshPayload, Tokens } from './../types/token';
import { buildTokens } from './buildTokens';
import { User, UserModel } from '../models/user';
import { addTokenSession } from './tokenSessions';
import { deleteUserSessions, findAndDeleteSession } from './tokenUtils';

export const updateTokens = async (refresh: string): Promise<Tokens | null> => {
    try {
        const payload: RefreshPayload = JSON.parse(decodeBase64(refresh.split('.')[0]))
        const { userId } = payload
        const hasUser = await User.findById(payload.userId) as UserModel
        const newTokens = buildTokens(userId)
        const hasSession = await findAndDeleteSession(userId, refresh)

        if (hasUser && hasSession) {
            const success = await addTokenSession(userId, newTokens)
            if (!success) throw new Error('Failed add token seddion')
        }
        if (!hasSession) {
            await deleteUserSessions(userId)
            return null
        }
        return newTokens
    } catch(e) {
        console.log(e)
        return null
    }
}

