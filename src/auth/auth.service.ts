import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { User } from '../users/users.entity'
import { SignUpAuthDto } from './dto/signup-auth.dto'
import { LogInAuthDto } from './dto/login-auth.dto';
import { compare, hash } from "bcrypt"
import { JwtService } from '@nestjs/jwt'
import { Role } from 'src/roles/rol.entity'
import { JwtRole } from './jwt/jwt-role'
import { PasswordAuthDto } from './dto/password-auth.dto';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Role) private rolesRepository: Repository<Role>,
        private jwtService: JwtService
    ) { }
    async signUp(signUpData: SignUpAuthDto) {
        const { email, phone } = signUpData
        const emailExist = await this.usersRepository.exist({ where: { email } })
        if (emailExist) throw new HttpException('Correo electrónico existente.', HttpStatus.CONFLICT)
        const phoneExist = await this.usersRepository.exist({ where: { phone } })
        if (phoneExist) throw new HttpException('Teléfono existente.', HttpStatus.CONFLICT)
        const newUser = this.usersRepository.create(signUpData)
        let rolesIds: string[] = []
        if (signUpData.rolesIds != undefined && signUpData.rolesIds != null && signUpData.rolesIds.length > 0) rolesIds = signUpData.rolesIds
        else rolesIds.push(JwtRole.CLIENT)
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
    async logIn(loginData: LogInAuthDto) {
        const { email, password } = loginData
        const userFound = await this.usersRepository.findOne({ where: { email }, relations: ['roles'] })
        if (!userFound) throw new HttpException('Correo electrónico inexistente.', HttpStatus.NOT_FOUND)
        const isPasswordValid = await compare(password, userFound.password)
        if (!isPasswordValid) throw new HttpException('Contraseña incorrecta.', HttpStatus.FORBIDDEN)
        const rolesIds = userFound.roles.map(rol => rol.id)
        const token = this.jwtService.sign({ id: userFound.id, name: userFound.name, roles: rolesIds })
        const data = {
            user: userFound,
            token: `Bearer ${token}`
        }
        delete data.user.password
        return data
    }
    async updatePassword(id: number, passworData: PasswordAuthDto) {
        const { oldPassword, newPassword } = passworData
        const userFound = await this.usersRepository.findOneBy({ id })
        if (!userFound) throw new HttpException("Usuario(a) inexistente.", HttpStatus.NOT_FOUND)
        const isPasswordValid = await compare(oldPassword, userFound.password)
        if (!isPasswordValid) throw new HttpException('Contraseña incorrecta.', HttpStatus.FORBIDDEN)
        userFound.password = await hash(newPassword, Number(process.env.HASH_SALT))
        return await this.usersRepository.save(userFound)
    }
    async deleteAccount(id: number) {
        const userFound = await this.usersRepository.exist({ where: { id } })
        if (!userFound) throw new HttpException("Usuario(a) inexistente.", HttpStatus.NOT_FOUND)
        return await this.usersRepository.delete(id)
    }
}