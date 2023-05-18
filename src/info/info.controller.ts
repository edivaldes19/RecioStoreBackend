import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common'
import { hasRoles } from 'src/auth/jwt/has-roles'
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard'
import { JwtRole } from 'src/auth/jwt/jwt-role'
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard'
import { InfoService } from './info.service'
import { CreateInfoDto } from './dto/create-info.dto'
import { UpdateInfoDto } from './dto/update-info.dto'
@Controller('info')
export class InfoController {
    constructor(private infoService: InfoService) { }
    @Get()
    async getInfo() {
        return await this.infoService.getInfo()
    }

    @Get('getInfoByKey/:key')
    async getInfoByKey(@Param('key') key: string) {
        return await this.infoService.getInfoByKey(key)
    }

    @hasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post('createInfo')
    async createInfo(@Body() info: CreateInfoDto) {
        return await this.infoService.createInfo(info)
    }

    @hasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('updateInfo/:key')
    async updateInfo(@Param('key') key: string, @Body() info: UpdateInfoDto) {
        return await this.infoService.updateInfo(key, info)
    }

    @hasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Delete('deleteInfo/:key')
    async deleteInfo(@Param('key') key: string) {
        return await this.infoService.deleteInfo(key)
    }
}