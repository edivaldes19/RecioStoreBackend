import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { User } from './users/users.entity'
import { AuthModule } from './auth/auth.module'
import { RolesModule } from './roles/roles.module'
import { Rol } from './roles/rol.entity'
import { CategoriesModule } from './categories/categories.module'
import { Category } from './categories/category.entity'
import { ProductsModule } from './products/products.module';
import { Product } from './products/product.entity'
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '17040053',
      database: 'recio_store',
      entities: [User, Rol, Category, Product],
      synchronize: true
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    CategoriesModule,
    ProductsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }