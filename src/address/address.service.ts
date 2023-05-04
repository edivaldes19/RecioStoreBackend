import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Address } from './address.entity'
import { Repository } from 'typeorm'
import { CreateAddressDto } from './dto/create-address.dto'
import { UpdateAddressDto } from './dto/update-address.dto'

@Injectable()
export class AddressService {
    constructor(@InjectRepository(Address) private addressRepository: Repository<Address>) { }
    async getAddressByUser(id_user: number) {
        return await this.addressRepository.findBy({ id_user })
    }
    async createAddress(address: CreateAddressDto) {
        const newAddress = this.addressRepository.create(address)
        return await this.addressRepository.save(newAddress)
    }
    async updateAddress(id: number, address: UpdateAddressDto) {
        const addressFound = await this.addressRepository.findOneBy({ id })
        if (!addressFound) throw new HttpException('Dirección inexistente.', HttpStatus.NOT_FOUND)
        const updatedAddress = Object.assign(addressFound, address)
        return await this.addressRepository.save(updatedAddress)
    }
    async deleteAddress(id: number) {
        const addressFound = await this.addressRepository.findOneBy({ id })
        if (!addressFound) throw new HttpException("Dirección inexistente.", HttpStatus.NOT_FOUND)
        return await this.addressRepository.delete(id)
    }
}