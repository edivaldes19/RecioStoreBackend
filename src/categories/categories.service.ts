import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from './category.entity'
import { Repository } from 'typeorm'
import { UpdateCategoryDto } from './dto/update-category.dto'
@Injectable()
export class CategoriesService {
    constructor(@InjectRepository(Category) private categoriesRepository: Repository<Category>) { }
    async getCategories() {
        return await this.categoriesRepository.find()
    }
    async createCategory(category: CreateCategoryDto) {
        const newCategory = this.categoriesRepository.create(category)
        return await this.categoriesRepository.save(newCategory)
    }
    async updateCategory(id: number, category: UpdateCategoryDto) {
        const categoryFound = await this.categoriesRepository.findOneBy({ id })
        if (!categoryFound) throw new HttpException("Categoría inexistente.", HttpStatus.NOT_FOUND)
        const updatedCategory = Object.assign(categoryFound, category)
        return await this.categoriesRepository.save(updatedCategory)
    }
    async deleteCategory(id: number) {
        const categoryFound = await this.categoriesRepository.findOneBy({ id })
        if (!categoryFound) throw new HttpException('Categoría inexistente.', HttpStatus.NOT_FOUND)
        await this.categoriesRepository.delete(id)
        return { url: categoryFound.img }
    }
}