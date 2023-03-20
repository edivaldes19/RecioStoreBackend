import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { UpdateUserDto } from './dto/update-user.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { hasRoles } from 'src/auth/jwt/has-roles'
import { JwtRole } from 'src/auth/jwt/jwt-role'
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }
    @hasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get()
    async findAll() {
        return await this.usersService.findAll()
    }
    @hasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('updateData/:id')
    async updateData(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
        return await this.usersService.updateData(id, user)
    }
    @hasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post('updateImage/:id')
    @UseInterceptors(FileInterceptor('file'))
    async updateImage(@UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
            new FileTypeValidator({ fileType: 'image/jpeg' })
        ]
    })) file: Express.Multer.File, @Param('id', ParseIntPipe) id: number) {
        return await this.usersService.updateImage(file, id)
    }
}