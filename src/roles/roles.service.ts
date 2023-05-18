import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Role } from './rol.entity'
import { CreateRolDto } from './dto/create-rol.dto'
@Injectable()
export class RolesService {
    constructor(@InjectRepository(Role) private rolesRepository: Repository<Role>) { }
    async createRole(role: CreateRolDto) {
        const newRole = this.rolesRepository.create(role)
        return await this.rolesRepository.save(newRole)
    }
}