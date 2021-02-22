import { User, UserModel } from './../../models/user';
import { userIdFromAccessToken } from './../../jwt/tokenUtils';
import { validateAccessToken } from './../../jwt/validateTokens';
import { ExpressApp } from './../../types/other';
import { UserInfoResp } from 'src/types/responseTypes';


export const userRouter = (app: ExpressApp) => {
    app.get('/user/userInfo', async (req, res) => {
        const access = req.headers.authorization
        const validate = validateAccessToken(access)
        if (validate.isValid) {
            const userId = userIdFromAccessToken(access)
            const user = await User.findById(userId) as UserModel
            if (!user) res.send('user not found')
            const resp = {
                email: user.email,
                nickName: user.nickName,
                id: user._id,
                roles: user.roles,
            } as UserInfoResp
            return res.send(JSON.stringify(resp))
        }
        res.send(validate.errorMessage)
    })
}