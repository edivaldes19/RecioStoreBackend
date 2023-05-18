import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Info } from './info.entity'
import { CreateInfoDto } from './dto/create-info.dto'
import { UpdateInfoDto } from './dto/update-info.dto'
@Injectable()
export class InfoService {
    constructor(@InjectRepository(Info) private infoRepository: Repository<Info>) { }
    async getInfo() {
        return await this.infoRepository.find()
    }
    async getInfoByKey(key: string) {
        const infoFound = await this.infoRepository.findOneBy({ key })
        if (!infoFound) throw new HttpException('Información inexistente.', HttpStatus.NOT_FOUND)
        return infoFound
    }
    async createInfo(info: CreateInfoDto) {
        const newInfo = this.infoRepository.create(info)
        return await this.infoRepository.save(newInfo)
    }
    async updateInfo(key: string, info: UpdateInfoDto) {
        const infoFound = await this.infoRepository.findOneBy({ key })
        if (!infoFound) throw new HttpException('Información inexistente.', HttpStatus.NOT_FOUND)
        const updatedInfo = Object.assign(infoFound, info)
        return await this.infoRepository.save(updatedInfo)
    }
    async deleteInfo(key: string) {
        const infoFound = await this.infoRepository.exist({ where: { key } })
        if (!infoFound) throw new HttpException("Información inexistente.", HttpStatus.NOT_FOUND)
        return await this.infoRepository.delete(key)
    }
}