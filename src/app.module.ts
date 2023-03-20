import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { User } from './users/users.entity'
import { AuthModule } from './auth/auth.module'
import { RolesModule } from './roles/roles.module';
import { Rol } from './roles/rol.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '17040053',
      database: 'recio_store',
      entities: [User, Rol],
      synchronize: true
    }),
    UsersModule,
    AuthModule,
    RolesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }