import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../users/users.entity'
import { RegisterAuthDto } from './dto/register-auth.dto'
import { LoginAuthDto } from './dto/login-auth.dto'
import { compare } from "bcrypt"

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }
    async register(user: RegisterAuthDto) {
        const { email, phone } = user
        const emailExist = await this.usersRepository.findOneBy({ email })
        if (emailExist) return new HttpException('Correo electrónico existente.', HttpStatus.CONFLICT)
        const phoneExist = await this.usersRepository.findOneBy({ phone })
        if (phoneExist) return new HttpException('Teléfono existente.', HttpStatus.CONFLICT)
        const newUser = this.usersRepository.create(user)
        return this.usersRepository.save(newUser)
    }
    async login(loginData: LoginAuthDto) {
        const { email, password } = loginData
        const userFound = await this.usersRepository.findOneBy({ email })
        if (!userFound) return new HttpException('Correo electrónico inexistente.', HttpStatus.NOT_FOUND)
        const isPasswordValid = await compare(password, userFound.password)
        if (!isPasswordValid) return new HttpException('Contraseña incorrecta.', HttpStatus.FORBIDDEN)
        return userFound
    }
}