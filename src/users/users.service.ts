import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './users.entity'
import { UpdateUserDto } from './dto/update-user.dto'
import storage = require('../utils/cloud_storage')
@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }
    async updateUser(id: number, user: UpdateUserDto) {
        const userFound = await this.usersRepository.findOneBy({ id })
        if (!userFound) throw new HttpException('Usuario inexistente.', HttpStatus.NOT_FOUND)
        const { name, surname, phone, notification_token } = user
        userFound.name = name
        userFound.surname = surname
        userFound.phone = phone
        userFound.notification_token = notification_token
        return await this.usersRepository.save(userFound)
    }
    async updateUserImage(id: number, file: Express.Multer.File) {
        const userFound = await this.usersRepository.findOneBy({ id })
        if (!userFound) throw new HttpException('Usuario inexistente.', HttpStatus.NOT_FOUND)
        const url = await storage(file, file.originalname)
        if (url == undefined || url == null) throw new HttpException('Error al subir la imagen.', HttpStatus.INTERNAL_SERVER_ERROR)
        userFound.img = url
        return await this.usersRepository.save(userFound)
    }
}