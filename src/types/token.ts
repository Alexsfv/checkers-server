export type AccessTokenPayload = {
    userId: string
    jti: string
    exp: number
}

export type Tokens = {
    access_token: string
    refresh_token: string
    exp_access: number
    exp_refresh: number
}

export type RefreshPayload = {
    userId: string
    exp: number
    rti: string
}