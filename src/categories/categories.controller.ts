import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, UploadedFile, UseGuards, UseInterceptors, Body, Post, Get, Put, Param, ParseIntPipe, Delete } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { hasRoles } from 'src/auth/jwt/has-roles'
import { JwtRole } from 'src/auth/jwt/jwt-role'
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
@Controller('categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) { }
    @Get()
    @hasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    async findAll() {
        return await this.categoriesService.findAll()
    }

    @hasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post('create')
    @UseInterceptors(FileInterceptor('file'))
    async create(@UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
            new FileTypeValidator({ fileType: 'image/jpeg' })
        ]
    })) file: Express.Multer.File, @Body() category: CreateCategoryDto) {
        return await this.categoriesService.create(file, category)
    }

    @hasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('updateCategory/:id')
    async updateCategory(@Param('id', ParseIntPipe) id: number, @Body() category: UpdateCategoryDto) {
        return await this.categoriesService.updateCategory(id, category)
    }

    @hasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('updateCategoryImage/:id')
    @UseInterceptors(FileInterceptor('file'))
    async updateCategoryImage(@UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
            new FileTypeValidator({ fileType: 'image/jpeg' })
        ]
    })) file: Express.Multer.File, @Param('id', ParseIntPipe) id: number) {
        return await this.categoriesService.updateCategoryImage(id, file)
    }

    @hasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Delete('delete/:id')
    async deleteCategory(@Param('id', ParseIntPipe) id: number) {
        return await this.categoriesService.delete(id)
    }
}