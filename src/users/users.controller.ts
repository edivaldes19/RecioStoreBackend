import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { UpdateUserDto } from './dto/update-user.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { hasRoles } from 'src/auth/jwt/has-roles'
import { JwtRole } from 'src/auth/jwt/jwt-role'
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard'
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }
    @hasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('updateUser/:id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
        return await this.usersService.updateUser(id, user)
    }

    @hasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('updateUserImage/:id')
    @UseInterceptors(FileInterceptor('file'))
    async updateUserImage(@UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
            new FileTypeValidator({ fileType: 'image/jpeg' })
        ]
    })) file: Express.Multer.File, @Param('id', ParseIntPipe) id: number) {
        return await this.usersService.updateUserImage(id, file)
    }
}