import { userRouter } from './routes/user/user';
import './dbConnection'
import express from 'express'
import cors from 'cors'
import { PORT } from './config'
import bodyParser from 'body-parser'
import authRoutes from './routes/auth/auth'

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

authRoutes(app)
userRouter(app)



app.listen(PORT, () => {
    return console.log('Server started on PORT ', PORT)
})