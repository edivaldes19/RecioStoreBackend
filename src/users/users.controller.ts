import { Body, Controller, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { UpdateUserDto } from './dto/update-user.dto'
import { hasRoles } from 'src/auth/jwt/has-roles'
import { JwtRole } from 'src/auth/jwt/jwt-role'
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard'
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }
    @hasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get('/:id')
    async getUsers(@Param('id', ParseIntPipe) id: number) {
        return await this.usersService.getUsers(id)
    }

    @hasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('updateUser/:id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
        return await this.usersService.updateUser(id, user)
    }

    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('updateUserToClient/:id')
    async updateUserToClient(@Param('id', ParseIntPipe) id: number) {
        return await this.usersService.updateUserToClient(id)
    }

    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('updateUserToAdmin/:id')
    async updateUserToAdmin(@Param('id', ParseIntPipe) id: number) {
        return await this.usersService.updateUserToAdmin(id)
    }
}