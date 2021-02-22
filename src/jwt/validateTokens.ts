import { RefreshPayload } from './../types/token';
import { SECRET_REFRESH } from './../config';
import { AccessTokenPayload } from '../types/token';
import { SECRET_JWT } from '../config';
import crypto from 'crypto'
import { decodeBase64 } from '../utils/utils';

type Validate = {
    isValid: boolean
    errorMessage: string
}

export const validateAccessToken = (token: string | undefined | null): Validate => {
    if (!token) return { isValid: false, errorMessage: 'Access token is empty' }
    const [header, payload, signature] = token.split('.')
    const compareSignature = crypto
        .createHmac('sha256', SECRET_JWT)
        .update(`${header}.${payload}`)
        .digest('base64')
    if (signature === compareSignature) {
        if (isAliveAccessToken(token)) {
            return { isValid: true, errorMessage: '' }
        }
        return { isValid: false, errorMessage: 'Access token is not alive' }
    }
    return { isValid: false, errorMessage: 'Signature of access token is wrong' }
}

export const validateRefreshToken = (refresh: string | undefined | null): Validate => {
    if (!refresh) return { isValid: false, errorMessage: 'Рефреш токен отсутствует'}
    const payload = decodeBase64(refresh.split('.')[0])
    const signature = refresh.split('.')[1]
    const compareSignature = crypto
        .createHmac('sha256', SECRET_REFRESH)
        .update(payload)
        .digest('base64')
    if (signature !== compareSignature) {
        return { isValid: false, errorMessage: 'Refresh token has been changed'}
    }
    const isAlive = isAliveRefreshToken(refresh)
    if (!isAlive) {
        return { isValid: false, errorMessage: 'Refresh token is not alive'}
    }
    return { isValid: true, errorMessage: ''}
}

export const isAliveAccessToken = (token: string | undefined) => {
    if (!token) return false
    const payload = JSON.parse(decodeBase64(token.split('.')[1])) as AccessTokenPayload
    return payload.exp > Date.now()
}

export const isAliveRefreshToken = (refresh: string | undefined) => {
    if (!refresh) return false
    const payload = JSON.parse(decodeBase64(refresh.split('.')[0])) as RefreshPayload
    return payload ? Date.now() < payload.exp : false
}