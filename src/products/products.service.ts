import { Like, Repository } from 'typeorm'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate'
import { Product } from './product.entity'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Category } from 'src/categories/category.entity'
import { ProductHasImages } from './product_has_images.entity'
@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product) private productsRepository: Repository<Product>,
        @InjectRepository(Category) private categoriesRepository: Repository<Category>,
        @InjectRepository(ProductHasImages) private phiRepository: Repository<ProductHasImages>
    ) { }
    async getProducts() {
        return await this.productsRepository.find({ relations: ['phi'] })
    }
    async getProductsByCategory(id_category: number) {
        return await this.productsRepository.find({ where: { id_category }, relations: ['phi'] })
    }
    async getProductsByName(name: string) {
        return this.productsRepository.find({ where: { name: Like(`%${name}%`) }, relations: ['phi'] })
    }
    async paginate(options: IPaginationOptions): Promise<Pagination<Product>> {
        return paginate<Product>(this.productsRepository, options)
    }
    async createProduct(product: CreateProductDto) {
        const categoryFound = await this.categoriesRepository.exist({ where: { id: product.id_category } })
        if (!categoryFound) throw new HttpException("Categoría inexistente.", HttpStatus.NOT_FOUND)
        if (product.phi == undefined || product.phi == null || product.phi.length == 0) throw new HttpException("Sin imágenes.", HttpStatus.NOT_FOUND)
        const newProduct = this.productsRepository.create(product)
        const savedProduct = await this.productsRepository.save(newProduct)
        for (const image of product.phi) {
            const phi = new ProductHasImages()
            phi.id_product = savedProduct.id
            phi.img_url = image.img_url
            await this.phiRepository.save(phi)
        }
        return savedProduct
    }
    async updateProduct(id: number, product: UpdateProductDto) {
        const productFound = await this.productsRepository.findOne({ where: { id }, relations: ['phi'] })
        if (!productFound) throw new HttpException("Producto inexistente.", HttpStatus.NOT_FOUND)
        if (product.phi != undefined && product.phi != null && product.phi.length > 0) {
            await this.phiRepository.delete({ id_product: productFound.id })
            for (const image of product.phi) {
                const phi = new ProductHasImages()
                phi.id_product = productFound.id
                phi.img_url = image.img_url
                await this.phiRepository.save(phi)
            }
        }
        const productUpdated = Object.assign(productFound, product)
        delete productUpdated.phi
        delete productUpdated.phi
        return await this.productsRepository.save(productUpdated)
    }
    async deleteProduct(id: number) {
        const productFound = await this.productsRepository.findOne({ where: { id }, relations: ['phi'] })
        if (!productFound) throw new HttpException("Producto inexistente.", HttpStatus.NOT_FOUND)
        await this.productsRepository.delete(id)
        return productFound
    }
}