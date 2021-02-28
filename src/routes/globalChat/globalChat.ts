import http from 'http';
import { GlobalMessageWSPayload, CreateGloballMessage } from './../../types/requestTypes';
import { validateAccessToken } from './../../jwt/validateTokens';
import { GlobalMessage, globalMessageModel } from '../../models/globalMessage';
import WebSocket from 'ws'
import { AllGlobalMessagesResp } from 'src/types/responseTypes';

const clients = new Set<WebSocket>()

const populateMessage = async(message: globalMessageModel | globalMessageModel[]) => {
    if (Array.isArray(message)) {
        const promises = message.map(m => m.populate({
            path: 'user',
            select: ['nickName', 'image']
        }).execPopulate())
        return await Promise.all(promises)
    }
    return await message.populate({
        path: 'user',
        select: ['nickName', 'image']
    }).execPopulate()
}

const createNewMessage = async(messageData: CreateGloballMessage) => {
    const { userId, text, created_at } = messageData
    const message = new GlobalMessage({
        user: userId,
        text,
        created_at
    })
    const newMessage = await message.save() as globalMessageModel
    const populatedMessage = await populateMessage(newMessage)
    return populatedMessage
}

const getAllMessages = async() => {
    const messages = await GlobalMessage.find() as globalMessageModel[]
    const populatedMessages = populateMessage(messages)
    return populatedMessages
}

const socketReducer = async(req: GlobalMessageWSPayload, socket: WebSocket) => {
    switch(req.type) {
        case('auth'): {
            const { isValid } = validateAccessToken(req.data.Authorization)
            if (!isValid) {
                socket.close(1000, 'not authorized')
                clients.delete(socket)
            }
            break
        }
        case('all_messages'): {
            const messages = await getAllMessages()
            const responseData = {
                type: 'all_messages',
                data: messages
            }
            console.log('responseData', responseData)
            socket.send(JSON.stringify(responseData))
            break
        }
        case('add_message'): {
            const addedMessage = await createNewMessage(req.data)
            clients.forEach(c => {
                const addedData = {
                    type: 'added_message',
                    data: addedMessage
                } as AllGlobalMessagesResp
                c.send(JSON.stringify(addedData))
            })
        }
    }
}


export default function globalChatRouter (server: http.Server) {

    const ws = new WebSocket.Server({ server, path: '/global_chat' })
    ws.on('connection', (socket) => {
        clients.add(socket)
        socket.on('message', async(payload: string) => {
            const req = JSON.parse(payload) as GlobalMessageWSPayload
            socketReducer(req, socket)
        })
        socket.on('close', () => {
            clients.delete(socket)
            console.log('leave', clients.size)
        })

    })
}