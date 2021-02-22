import express from 'express'

export type ExpressApp = ReturnType<typeof express>
export type Roles = 'user' | 'admin'

export type TrimUser = {
    email: string
    nickName: string
    roles: string[]
}