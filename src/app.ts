import { userRouter } from './routes/user/user';
import './dbConnection'
import http from 'http'
import express from 'express'
import cors from 'cors'
import { PORT } from './config'
import bodyParser from 'body-parser'
import authRoutes from './routes/auth/auth'
import globalChatRouter from './routes/globalChat/globalChat';

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


authRoutes(app)
userRouter(app)
globalChatRouter(server)



server.listen(PORT, () => {
    return console.log('Server started on PORT ', PORT)
})