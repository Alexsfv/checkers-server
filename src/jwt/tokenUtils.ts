import { decodeBase64 } from './../utils/utils';
import { TokenSession, TokenSessionModel } from './../models/tokenSession';
import { User, UserModel } from './../models/user';
import { AccessTokenPayload, RefreshPayload } from './../types/token';

export const userIdFromAccessToken = (token: string | null | undefined) => {
    if (!token) return null
    const payload = decodeBase64(token.split('.')[1])
    const decodedPayload = JSON.parse(payload) as AccessTokenPayload
    return decodedPayload.userId
}

export const userIdFromRefreshToken = (refresh: string | null | undefined) => {
    if (!refresh) return null
    const payload = decodeBase64(refresh.split('.')[0])
    const decodedPayload = JSON.parse(payload) as RefreshPayload
    return decodedPayload.userId
}

export const findAndDeleteSession = async (userId: string, refresh: string) => {
    const tokenSession = await TokenSession.findOne({ refresh_token: refresh }) as TokenSessionModel
    const user = await User.findOne({ _id: userId }) as UserModel
    if (tokenSession && user) {
        user.tokenSessions = user.tokenSessions.filter(sessionId => sessionId.toString() !== tokenSession._id.toString())
        await user.save()
        await tokenSession.delete()
    }
    return !!tokenSession
}

export const deleteUserSessions = async(userId: string) => {
    const user = await User.findOne({ _id: userId }) as UserModel
    if (user) {
        user.tokenSessions = []
        await user.save()
        return await TokenSession.deleteMany({ userId: user._id })
    }
    throw new Error('Error delete user token sessions')
}