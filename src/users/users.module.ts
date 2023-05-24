import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './users.entity'
import { JwtStrategy } from '../auth/jwt/jwt.strategy'
import { Role } from '../roles/rol.entity'
import { Order } from 'src/orders/order.entity'
import { jwtConstants } from 'src/auth/jwt/jwt.constants'
import { JwtModule } from '@nestjs/jwt'
@Module({
    imports: [TypeOrmModule.forFeature([User, Role, Order]), JwtModule.register({ secret: jwtConstants.secret })],
    providers: [UsersService, JwtStrategy],
    controllers: [UsersController]
})
export class UsersModule { }