import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignUpAuthDto } from './dto/signup-auth.dto'
import { LoginAuthDto } from './dto/login-auth.dto'
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post('signup')
    async signUp(@Body() user: SignUpAuthDto) {
        return await this.authService.signUp(user)
    }
    @Post('login')
    async logIn(@Body() loginData: LoginAuthDto) {
        return await this.authService.logIn(loginData)
    }
}