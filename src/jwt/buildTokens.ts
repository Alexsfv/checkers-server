import { AccessTokenPayload, RefreshPayload, Tokens } from './../types/token';
import { SECRET_JWT, SECRET_REFRESH } from './../config';
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

const exp_access = 12 * 1000
const exp_refresh = 600 * 1000

export const buildTokens = (userId: string): Tokens => {
    const access_token = buildAccessToken(userId.toString())
    const refresh_token = buildRefreshToken(userId.toString())
    return {
        access_token,
        refresh_token,
        exp_access: Date.now() + exp_access,
        exp_refresh: Date.now() + exp_refresh
    }
}

const buildAccessToken = (userId: string) => {
    const header = Buffer.from(JSON.stringify({
        alg: 'HS256',
        typ: 'jwt'
    })).toString('base64')

    const payload = Buffer.from(JSON.stringify({
        userId: userId,
        jti: uuidv4(),
        exp: Date.now() + exp_access
    } as AccessTokenPayload)).toString('base64')

    const signature = crypto
        .createHmac('sha256', SECRET_JWT)
        .update(`${header}.${payload}`)
        .digest('base64')

    return `${header}.${payload}.${signature}`
}

const buildRefreshToken = (userId: string) => {
    const rti = Buffer.from(uuidv4()).toString('base64')
    const refreshPayload = JSON.stringify({
        userId,
        exp: Date.now() + exp_refresh,
        rti,
    } as RefreshPayload)
    const userEncoded = Buffer.from(refreshPayload).toString('base64')
    const signature = crypto
        .createHmac('sha256', SECRET_REFRESH)
        .update(refreshPayload)
        .digest('base64')
    return `${userEncoded}.${signature}`
}