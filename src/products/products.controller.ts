import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, UseGuards, UseInterceptors, Body, Post, Get, Put, Param, ParseIntPipe, Delete, UploadedFiles, Query, DefaultValuePipe } from '@nestjs/common'
import { ProductsService } from './products.service'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { FilesInterceptor } from '@nestjs/platform-express'
import { hasRoles } from 'src/auth/jwt/has-roles'
import { JwtRole } from 'src/auth/jwt/jwt-role'
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Product } from './product.entity'
import { API } from 'src/config/config'
@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }
    @hasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get('pagination')
    async pagination(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
    ): Promise<Pagination<Product>> {
        return this.productsService.paginate({ page, limit, route: `http://${API}:3000/products/pagination` })
    }

    @hasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get()
    async getProducts() {
        return await this.productsService.getProducts()
    }

    @hasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get('getProductsByCategory/:id_category')
    async getProductsByCategory(@Param('id_category', ParseIntPipe) id_category: number) {
        return await this.productsService.getProductsByCategory(id_category)
    }

    @hasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get('getProductsByName/:name')
    async getProductsByName(@Param('name') name: string) {
        return await this.productsService.getProductsByName(name)
    }

    @hasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post('createProduct')
    @UseInterceptors(FilesInterceptor('files[]', 2))
    async createProduct(@UploadedFiles(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
            new FileTypeValidator({ fileType: 'image/jpeg' })
        ]
    })) files: Array<Express.Multer.File>, @Body() product: CreateProductDto) {
        return await this.productsService.createProduct(files, product)
    }

    @hasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('updateProduct/:id')
    async updateProduct(@Param('id', ParseIntPipe) id: number, @Body() product: UpdateProductDto) {
        return await this.productsService.updateProduct(id, product)
    }

    @hasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('updateProductImages/:id')
    @UseInterceptors(FilesInterceptor('files[]', 2))
    async updateProductImages(@UploadedFiles(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
            new FileTypeValidator({ fileType: 'image/jpeg' })
        ]
    })) files: Array<Express.Multer.File>, @Param('id', ParseIntPipe) id: number, @Body() product: UpdateProductDto) {
        return await this.productsService.updateProductImages(files, id, product)
    }

    @hasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Delete('deleteProduct/:id')
    async deleteProduct(@Param('id', ParseIntPipe) id: number) {
        return await this.productsService.deleteProduct(id)
    }
}