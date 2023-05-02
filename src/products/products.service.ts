import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UpdateProductDto } from './dto/update-product.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from './product.entity'
import { Repository } from 'typeorm'
import { CreateProductDto } from './dto/create-product.dto'
import asyncForEach = require('../utils/async_foreach')
import storage = require('../utils/cloud_storage')
@Injectable()
export class ProductsService {
    constructor(@InjectRepository(Product) private productsRepository: Repository<Product>) { }
    async getProducts() {
        return await this.productsRepository.find()
    }
    async getProductsByCategory(id_category: number) {
        return await this.productsRepository.findBy({ id_category })
    }
    async createProduct(files: Array<Express.Multer.File>, product: CreateProductDto) {
        if (files.length == 0) throw new HttpException("Sin imágenes.", HttpStatus.NOT_FOUND)
        let uploadedFiles = 0
        const newProduct = this.productsRepository.create(product)
        const savedProduct = await this.productsRepository.save(newProduct)
        await asyncForEach(files, async (file: Express.Multer.File) => {
            const url = await storage(file, file.originalname)
            if (url != undefined && url != null) {
                switch (uploadedFiles) {
                    case 0: savedProduct.img1 = url; break
                    case 1: savedProduct.img2 = url; break
                }
            }
            await this.updateProduct(savedProduct.id, savedProduct)
            uploadedFiles++
        })
        return savedProduct
    }
    async updateProduct(id: number, product: UpdateProductDto) {
        const productFound = await this.productsRepository.findOneBy({ id })
        if (!productFound) throw new HttpException("Producto inexistente.", HttpStatus.NOT_FOUND)
        const updatedProduct = Object.assign(productFound, product)
        return await this.productsRepository.save(updatedProduct)
    }
    async updateProductImages(files: Array<Express.Multer.File>, id: number, product: UpdateProductDto) {
        if (files.length == 0) throw new HttpException("Sin imágenes.", HttpStatus.NOT_FOUND)
        let counter = 0
        let uploadedFiles = Number(product.images_to_update[counter])
        const updatedProduct = await this.updateProduct(id, product)
        await asyncForEach(files, async (file: Express.Multer.File) => {
            const url = await storage(file, file.originalname)
            if (url != undefined && url != null) {
                switch (uploadedFiles) {
                    case 0: updatedProduct.img1 = url; break
                    case 1: updatedProduct.img2 = url; break
                }
            }
            await this.updateProduct(updatedProduct.id, updatedProduct)
            counter++
            uploadedFiles = Number(product.images_to_update[counter])
        })
        return updatedProduct
    }
    async deleteProduct(id: number) {
        const productFound = await this.productsRepository.findOneBy({ id })
        if (!productFound) throw new HttpException("Producto inexistente.", HttpStatus.NOT_FOUND)
        return await this.productsRepository.delete(id)
    }
}