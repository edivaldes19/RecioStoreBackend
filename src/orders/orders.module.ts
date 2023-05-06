import { Module } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from './order.entity'
import { OrderHasProducts } from './order_has_products.entity'
import { User } from 'src/users/users.entity'
import { Address } from 'src/address/address.entity'
import { Product } from 'src/products/product.entity'
@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderHasProducts, User, Address, Product])],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule { }