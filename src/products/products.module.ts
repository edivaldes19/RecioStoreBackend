import { Module } from '@nestjs/common'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './product.entity'
import { Category } from 'src/categories/category.entity'
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy'
import { OrderHasProducts } from 'src/orders/order_has_products.entity'
import { ProductHasImages } from './product_has_images.entity'
@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, OrderHasProducts, ProductHasImages])],
  controllers: [ProductsController],
  providers: [ProductsService, JwtStrategy]
})
export class ProductsModule { }