import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { User } from '../users/users.entity'
import { RegisterAuthDto } from './dto/register-auth.dto'
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
    async register(user: RegisterAuthDto) {
        const { email, phone } = user
        const emailExist = await this.usersRepository.findOneBy({ email })
        if (emailExist) throw new HttpException('Correo electrónico existente.', HttpStatus.CONFLICT)
        const phoneExist = await this.usersRepository.findOneBy({ phone })
        if (phoneExist) throw new HttpException('Teléfono existente.', HttpStatus.CONFLICT)
        const newUser = this.usersRepository.create(user)
        let rolesIds = []
        if (user.rolesIds != undefined || user.rolesIds != null || user.rolesIds.length == 0) rolesIds = user.rolesIds
        else rolesIds.push('client')
        newUser.roles = await this.rolesRepository.findBy({ id: In(user.rolesIds) })
        const userSaved = await this.usersRepository.save(newUser)
        const rolesString = userSaved.roles.map(rol => rol.id)
        const { id, name } = userSaved
        const token = this.jwtService.sign({ id, name, roles: rolesString })
        delete userSaved.password
        return { user: userSaved, token: `Bearer ${token}` }
    }
    async login(loginData: LoginAuthDto) {
        const { email, password } = loginData
        const userFound = await this.usersRepository.findOne({ where: { email }, relations: ['roles'] })
        if (!userFound) throw new HttpException('Correo electrónico inexistente.', HttpStatus.NOT_FOUND)
        const isPasswordValid = await compare(password, userFound.password)
        if (!isPasswordValid) throw new HttpException('Contraseña incorrecta.', HttpStatus.FORBIDDEN)
        const rolesIds = userFound.roles.map(rol => rol.id)
        const { id, name } = userFound
        const token = this.jwtService.sign({ id, name, roles: rolesIds })
        delete userFound.password
        return { user: userFound, token: `Bearer ${token}` }
    }
}