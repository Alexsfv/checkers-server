import { findAndDeleteSession, userIdFromRefreshToken } from './tokenUtils';


export const logoutUser = async (refresh: string) => {
    try {
        const userId = userIdFromRefreshToken(refresh)
        if (userId) {
            await findAndDeleteSession(userId, refresh)
            return true
        }
        return null
    } catch(e) {
        console.log(e)
        return null
    }
}