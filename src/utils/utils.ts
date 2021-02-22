import { UserModel } from './../models/user';
import { SALT_ROUNDS } from './../config';
import bcrypt from 'bcrypt'
import { TrimUser } from 'src/types/other';


export const decodeBase64 = (value: string) => Buffer.from(value, 'base64').toString()

export const hashPassword = async (password: string) => {
    let hashPassword: string = ''
    await bcrypt.hash(password, SALT_ROUNDS)
        .then(hash => hashPassword = hash)
        .catch(e => console.log(e))
    return hashPassword
}

export const comparePasswords = async (password: string, hashPassword: string) => {
    let isEqual: boolean = false
    await bcrypt.compare(password, hashPassword)
        .then(result => isEqual = result)
        .catch(e => console.log(e))
    return isEqual
}

export const trimUser = (user: UserModel): TrimUser => {
    const newUser = {...user}
    return {
        email: newUser.email,
        nickName: newUser.nickName,
        roles: newUser.roles,
    }
}