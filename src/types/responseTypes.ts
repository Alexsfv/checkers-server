import { globalMessageModel } from './../models/globalMessage'
import { Roles } from "./other"

export type UniqueEmailResponse = {
    email: string
    isUnique: boolean
}

export type LoginData = {
    success: boolean
    tokens: {
        access_token: string
        refresh_token: string
    }
    message?: string
}


export type UserInfoResp = {
    email: string
    nickName: string
    id: string
    roles: Roles[]
    image: string
}


/// WS

// global message
export type AllGlobalMessagesResp = {
    type: 'added_message',
    data: globalMessageModel[]
}
//