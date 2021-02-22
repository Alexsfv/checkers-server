import { hashPassword, comparePasswords, trimUser } from './../../utils/utils';
import { validateRefreshToken } from './../../jwt/validateTokens';
import { addTokenSession } from './../../jwt/tokenSessions';
import { buildTokens } from '../../jwt/buildTokens';
import { UniqueEmailResponse } from "src/types/responseTypes"
import { User, UserModel } from '../../models/user'
import { RegisterData } from "src/types/requestTypes"
import { ExpressApp } from "src/types/other"
import { updateTokens } from '../../jwt/updateTokens';
import { logoutUser } from '../../jwt/logout';

export default function authRoutes (app: ExpressApp) {

    app.put('/register', async (req, res) => {
        const { nickName, email, password } = req.body as RegisterData
        const hashedPassword = await hashPassword(password)
        if (!hashedPassword) return res.status(500).send('Error hash password')
        const data = {
            email,
            nickName,
            password: hashedPassword,
            roles: ['user']
        }
        const user = new User(data) as UserModel
        await user.save()
        res.send(JSON.stringify('success register'))
    })

    app.post('/login', async(req, res) => {
        const { email, password } = req.body
        const user = await User.findOne({ email: email }).populate('tokenSession') as UserModel
        if (user) {
            const isValidPassword = await comparePasswords(password, user.password)
            if (!isValidPassword) return res.status(401).send('wrong password')
            const tokens = buildTokens(user._id)
            const updatedUser = await addTokenSession(user._id, tokens)
            const resp = { success: !!updatedUser, tokens }
            return res.send(JSON.stringify(resp))
        }
        const resp = { user: trimUser(user), success: !!user }
        res.send(JSON.stringify(resp))
    })

    app.get('/token/refresh', async (req, res) => {
        try {
            const refresh = req.headers.authorization
            if (!refresh) {
                return res.status(401)
                    .send(JSON.stringify({ message: 'Отсутствует refresh' }))
            }
            const validate = validateRefreshToken(refresh)
            if (validate.isValid) {
                const newTokens = await updateTokens(refresh as string)
                return newTokens
                    ? res.send(JSON.stringify(newTokens))
                    : res.status(401).send(JSON.stringify({
                        message: 'Update token error'
                    }))
            }
            res.status(401).send(JSON.stringify({
                message: validate.errorMessage
            }))
        } catch(e) {
            console.log(e)
            res.status(500).send(JSON.stringify({ message: e.message }))
        }
    })

    app.post('/logout', async(req, res) => {
        const refresh = req.body.refresh_token
        const validate = validateRefreshToken(refresh)
        if (validate.isValid) {
            const isLogout = await logoutUser(refresh)
            return isLogout
                ? res.send('success logout')
                : res.send('logout without delete session')
        }
        res.send(validate.errorMessage)
    })

    app.post('/unique/email', async(req, res) => {
        const user = await User.findOne({ email: req.body.email })
        const resp: UniqueEmailResponse = {
            email: req.body.email,
            isUnique: !Boolean(user)
        }
        res.send(JSON.stringify(resp))
    })
}