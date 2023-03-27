import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CreateRolDto } from './dto/create-rol.dto'
import { RolesService } from './roles.service'
@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) { }
    @Post('create')
    async create(@Body() rol: CreateRolDto) {
        return await this.rolesService.create(rol)
    }
}