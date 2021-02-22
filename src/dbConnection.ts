import mongoose from 'mongoose'
import { DB_PASSWORD, DB_NAME } from './config'

mongoose.connect(
    `mongodb+srv://adm:${DB_PASSWORD}@cluster0.jsbsc.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    {useNewUrlParser: true, useUnifiedTopology: true}
)

mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
mongoose.connection.once('open', function() {
  console.log('Mongoose connected')
})