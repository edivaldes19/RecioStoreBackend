import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { hasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';
@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) { }
    @hasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post('create')
    async create(@Body() rol: CreateRolDto) {
        return await this.rolesService.create(rol)
    }
}