import express from 'express'
import random from './module/util'

const app = express()
const PORT = 3333

app.get('/', (req, res) => {
    res.send(`Success request ${random()}`)
})


app.listen(PORT, () => {
    return console.log('Server started on PORT ', PORT)
})