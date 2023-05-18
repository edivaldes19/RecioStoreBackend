import { Module } from '@nestjs/common'
import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Role } from './rol.entity'
import { User } from '../users/users.entity'
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  providers: [RolesService, JwtStrategy],
  controllers: [RolesController]
})
export class RolesModule { }