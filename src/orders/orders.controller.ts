import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common'
import { hasRoles } from 'src/auth/jwt/has-roles'
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard'
import { JwtRole } from 'src/auth/jwt/jwt-role'
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) { }
    @hasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get()
    async getOrders() {
        return await this.ordersService.getOrders()
    }

    @hasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get('getOrdersByClient/:id_client')
    async getOrdersByClient(@Param('id_client', ParseIntPipe) id_client: number) {
        return await this.ordersService.getOrdersByClient(id_client)
    }

    @hasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post('createOrder')
    async createOrder(@Body() order: CreateOrderDto) {
        return await this.ordersService.createOrder(order)
    }

    @hasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('updateOrder/:id')
    async updateOrder(@Param('id', ParseIntPipe) id: number) {
        return await this.ordersService.updateOrderStatus(id)
    }

    @hasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('deleteOrder/:id')
    async deleteOrder(@Param('id', ParseIntPipe) id: number) {
        return await this.ordersService.deleteOrder(id)
    }
}