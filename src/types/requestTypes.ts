export type RegisterData = {
    nickName: string
    email: string
    password: string
    image: string
}

export type LoginData = {
    email: string
    password: string
}


/// WS

// global chat
type GlobalMessageOpenPayload = {
    type: 'auth',
    data: { Authorization: string }
}

type GlobalMessageAdd = {
    type: 'add_message',
    data: CreateGloballMessage
}

type GlobalMessageAllMessages = {
    type: 'all_messages'
}

export type GlobalMessageWSPayload = GlobalMessageOpenPayload | GlobalMessageAdd | GlobalMessageAllMessages

export type CreateGloballMessage = {
    userId: string,
    text: string,
    created_at: number
}
//