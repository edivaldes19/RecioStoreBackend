import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Rol } from './rol.entity'
import { CreateRolDto } from './dto/create-rol.dto'
@Injectable()
export class RolesService {
    constructor(@InjectRepository(Rol) private rolesRepository: Repository<Rol>) { }
    async create(rol: CreateRolDto) {
        const newRol = this.rolesRepository.create(rol)
        return await this.rolesRepository.save(newRol)
    }
}