import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import storage = require('../utils/cloud_storage')
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from './category.entity'
import { Repository } from 'typeorm'
import { UpdateCategoryDto } from './dto/update-category.dto';
@Injectable()
export class CategoriesService {
    constructor(@InjectRepository(Category) private categoriesRepository: Repository<Category>) { }
    async findAll() {
        return await this.categoriesRepository.find()
    }
    async create(file: Express.Multer.File, category: CreateCategoryDto) {
        const url = await storage(file, file.originalname)
        if (url == undefined || url == null) throw new HttpException("Error al subir la imagen.", HttpStatus.INTERNAL_SERVER_ERROR)
        category.img = url
        const newCategory = this.categoriesRepository.create(category)
        return await this.categoriesRepository.save(newCategory)
    }
    async updateCategory(id: number, category: UpdateCategoryDto) {
        const categoryFound = await this.categoriesRepository.findOneBy({ id })
        if (!categoryFound) throw new HttpException("Categoría inexistente.", HttpStatus.NOT_FOUND)
        const { name, description, img } = category
        categoryFound.name = name
        categoryFound.description = description
        categoryFound.img = img
        return await this.categoriesRepository.save(categoryFound)
    }
    async updateCategoryImage(id: number, file: Express.Multer.File) {
        const categoryFound = await this.categoriesRepository.findOneBy({ id })
        if (!categoryFound) throw new HttpException('Categoría inexistente.', HttpStatus.NOT_FOUND)
        const url = await storage(file, file.originalname)
        if (url == undefined || url == null) throw new HttpException('Error al subir la imagen.', HttpStatus.INTERNAL_SERVER_ERROR)
        categoryFound.img = url
        return await this.categoriesRepository.save(categoryFound)
    }
    async delete(id: number) {
        const categoryFound = await this.categoriesRepository.findOneBy({ id })
        if (!categoryFound) throw new HttpException('Categoría inexistente.', HttpStatus.NOT_FOUND)
        return await this.categoriesRepository.delete(id)
    }
}