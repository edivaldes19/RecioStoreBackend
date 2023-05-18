import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CreateRolDto } from './dto/create-rol.dto'
import { RolesService } from './roles.service'
@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) { }
    @Post('createRole')
    async createRole(@Body() role: CreateRolDto) {
        return await this.rolesService.createRole(role)
    }
}