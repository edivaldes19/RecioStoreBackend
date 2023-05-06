import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { User } from '../users/users.entity'
import { SignUpAuthDto } from './dto/signup-auth.dto'
import { LoginAuthDto } from './dto/login-auth.dto'
import { compare } from "bcrypt"
import { JwtService } from '@nestjs/jwt'
import { Rol } from 'src/roles/rol.entity'
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Rol) private rolesRepository: Repository<Rol>,
        private jwtService: JwtService
    ) { }
    async signUp(signUpData: SignUpAuthDto) {
        const { email, phone } = signUpData
        const emailExist = await this.usersRepository.findOneBy({ email })
        if (emailExist) throw new HttpException('Correo electrónico existente.', HttpStatus.CONFLICT)
        const phoneExist = await this.usersRepository.findOneBy({ phone: phone })
        if (phoneExist) throw new HttpException('Teléfono existente.', HttpStatus.CONFLICT)
        const newUser = this.usersRepository.create(signUpData)
        let rolesIds: string[] = []
        if (signUpData.rolesIds != undefined && signUpData.rolesIds != null) rolesIds = signUpData.rolesIds
        else rolesIds.push('client')
        const roles = await this.rolesRepository.findBy({ id: In(rolesIds) })
        newUser.roles = roles
        const userSaved = await this.usersRepository.save(newUser)
        const rolesString = userSaved.roles.map(rol => rol.id)
        const token = this.jwtService.sign({ id: userSaved.id, name: userSaved.name, roles: rolesString })
        const data = {
            user: userSaved,
            token: `Bearer ${token}`
        }
        delete data.user.password
        return data
    }
    async logIn(loginData: LoginAuthDto) {
        const { email, password } = loginData
        const userFound = await this.usersRepository.findOne({ where: { email: email }, relations: ['roles'] })
        if (!userFound) throw new HttpException('Correo electrónico inexistente.', HttpStatus.NOT_FOUND)
        const isPasswordValid = await compare(password, userFound.password)
        if (!isPasswordValid) throw new HttpException('Contraseña incorrecta.', HttpStatus.FORBIDDEN)
        const rolesIds = userFound.roles.map(rol => rol.id)
        const token = this.jwtService.sign({ id: userFound.id, name: userFound.name, roles: rolesIds })
        const data = {
            user: userFound,
            token: 'Bearer ' + token
        }
        delete data.user.password
        return data
    }
}