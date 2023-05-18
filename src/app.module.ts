import { Module, Delete } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { User } from './users/users.entity'
import { AuthModule } from './auth/auth.module'
import { RolesModule } from './roles/roles.module'
import { Role } from './roles/rol.entity'
import { CategoriesModule } from './categories/categories.module'
import { Category } from './categories/category.entity'
import { ProductsModule } from './products/products.module';
import { Product } from './products/product.entity'
import { AddressModule } from './address/address.module';
import { Address } from './address/address.entity'
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/order.entity'
import { OrderHasProducts } from './orders/order_has_products.entity'
import { InfoModule } from './info/info.module';
import { Info } from './info/info.entity';
import { ProductHasImages } from './products/product_has_images.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '17040053',
      database: 'recio_store',
      entities: [User, Role, Category, Product, Address, Order, OrderHasProducts, Info, ProductHasImages],
      synchronize: true
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    CategoriesModule,
    ProductsModule,
    AddressModule,
    OrdersModule,
    InfoModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }