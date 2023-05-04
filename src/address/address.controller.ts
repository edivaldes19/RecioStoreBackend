import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common'
import { AddressService } from './address.service'
import { hasRoles } from 'src/auth/jwt/has-roles'
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard'
import { JwtRole } from 'src/auth/jwt/jwt-role'
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard'
import { CreateAddressDto } from './dto/create-address.dto'
import { UpdateAddressDto } from './dto/update-address.dto'
@Controller('address')
export class AddressController {
    constructor(private addressService: AddressService) { }
    @hasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get('getAddressByUser/:id_user')
    async getAddressByUser(@Param('id_user', ParseIntPipe) id_user: number) {
        return await this.addressService.getAddressByUser(id_user)
    }

    @hasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post('createAddress')
    async createAddress(@Body() address: CreateAddressDto) {
        return await this.addressService.createAddress(address)
    }

    @hasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('updateAddress/:id')
    async updateAddress(@Param('id', ParseIntPipe) id: number, @Body() address: UpdateAddressDto) {
        return await this.addressService.updateAddress(id, address)
    }

    @hasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Delete('deleteAddress/:id')
    async deleteAddress(@Param('id', ParseIntPipe) id: number) {
        return await this.addressService.deleteAddress(id)
    }
}