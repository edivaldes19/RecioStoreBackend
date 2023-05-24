import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignUpAuthDto } from './dto/signup-auth.dto'
import { LogInAuthDto } from './dto/login-auth.dto'
import { hasRoles } from './jwt/has-roles'
import { JwtRole } from './jwt/jwt-role'
import { JwtAuthGuard } from './jwt/jwt-auth.guard'
import { JwtRolesGuard } from './jwt/jwt-roles.guard'
import { PasswordAuthDto } from './dto/password-auth.dto'
import { NotifTokenAuthDto } from './dto/notiftoken-auth.dto'
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post('signUp')
    async signUp(@Body() user: SignUpAuthDto) {
        return await this.authService.signUp(user)
    }

    @Post('logIn')
    async logIn(@Body() loginData: LogInAuthDto) {
        return await this.authService.logIn(loginData)
    }

    @hasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('updatePassword/:id')
    async updatePassword(@Param('id', ParseIntPipe) id: number, @Body() passworData: PasswordAuthDto) {
        return await this.authService.updatePassword(id, passworData)
    }

    @Put('updateNotificationToken/:id')
    async updateNotificationToken(@Param('id', ParseIntPipe) id: number, @Body() notifData: NotifTokenAuthDto) {
        return await this.authService.updateNotificationToken(id, notifData)
    }

    @hasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Delete('deleteAccount/:id')
    async deleteAccount(@Param('id', ParseIntPipe) id: number) {
        return await this.authService.deleteAccount(id)
    }
}