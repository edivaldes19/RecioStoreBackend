import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../users/users.entity'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './jwt/jwt.constants'
import { JwtStrategy } from './jwt/jwt.strategy';
import { Role } from '../roles/rol.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Role]),
  JwtModule.register({ secret: jwtConstants.secret })],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule { }