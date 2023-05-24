import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Not, Repository } from 'typeorm'
import { User } from './users.entity'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtRole } from 'src/auth/jwt/jwt-role'
import { Role } from 'src/roles/rol.entity'
import { JwtService } from '@nestjs/jwt'
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Role) private rolesRepository: Repository<Role>,
        private jwtService: JwtService
    ) { }
    async getUsers(id: number) {
        const myUserFound = await this.usersRepository.exist({ where: { id } })
        if (!myUserFound) throw new HttpException('Usuario(a) inexistente.', HttpStatus.NOT_FOUND)
        return await this.usersRepository.find({ where: { id: Not(id) }, relations: ['roles'] })
    }
    async updateUser(id: number, user: UpdateUserDto) {
        const userFound = await this.usersRepository.findOneBy({ id })
        if (!userFound) throw new HttpException('Usuario(a) inexistente.', HttpStatus.NOT_FOUND)
        const updatedUser = Object.assign(userFound, user)
        return await this.usersRepository.save(updatedUser)
    }
    async updateUserToClient(id: number) {
        const userFound = await this.usersRepository.findOne({ where: { id }, relations: ['roles'] })
        if (!userFound) throw new HttpException('Usuario(a) inexistente.', HttpStatus.NOT_FOUND)
        let rolesIds: string[] = userFound.roles.map(rol => rol.id)
        if (rolesIds == undefined || rolesIds == null || rolesIds.length == 0) rolesIds.push(JwtRole.CLIENT)
        else {
            if (rolesIds.includes(JwtRole.CLIENT)) throw new HttpException(`El usuario(a) ${userFound.name} ya es cliente.`, HttpStatus.CONFLICT)
            else rolesIds.push(JwtRole.CLIENT)
        }
        const roles = await this.rolesRepository.findBy({ id: In(rolesIds) })
        userFound.roles = roles
        const userSaved = await this.usersRepository.save(userFound)
        const rolesString = userSaved.roles.map(rol => rol.id)
        const token = this.jwtService.sign({ id: userSaved.id, name: userSaved.name, roles: rolesString })
        const data = {
            user: userSaved,
            token: `Bearer ${token}`
        }
        delete data.user.password
        return data
    }
    async updateUserToAdmin(id: number) {
        const userFound = await this.usersRepository.findOne({ where: { id }, relations: ['roles'] })
        if (!userFound) throw new HttpException('Usuario(a) inexistente.', HttpStatus.NOT_FOUND)
        let rolesIds: string[] = userFound.roles.map(rol => rol.id)
        if (rolesIds == undefined || rolesIds == null || rolesIds.length == 0) rolesIds.push(JwtRole.CLIENT)
        if (rolesIds.includes(JwtRole.ADMIN)) throw new HttpException(`El usuario(a) ${userFound.name} ya es administrador(a).`, HttpStatus.CONFLICT)
        rolesIds.push(JwtRole.ADMIN)
        const roles = await this.rolesRepository.findBy({ id: In(rolesIds) })
        userFound.roles = roles
        const userSaved = await this.usersRepository.save(userFound)
        const rolesString = userSaved.roles.map(rol => rol.id)
        const token = this.jwtService.sign({ id: userSaved.id, name: userSaved.name, roles: rolesString })
        const data = {
            user: userSaved,
            token: `Bearer ${token}`
        }
        delete data.user.password
        return data
    }
}