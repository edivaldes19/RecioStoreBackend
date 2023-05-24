import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Order } from './order.entity'
import { Repository } from 'typeorm'
import { OrderHasProducts } from './order_has_products.entity'
import { CreateOrderDto } from './dto/create-order.dto'
import { User } from 'src/users/users.entity'
import { Address } from 'src/address/address.entity'
import { Product } from 'src/products/product.entity'
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase'
@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order) private ordersRepository: Repository<Order>,
        @InjectRepository(OrderHasProducts) private ohpRepository: Repository<OrderHasProducts>,
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Address) private addressRepository: Repository<Address>,
        @InjectRepository(Product) private productsRepository: Repository<Product>,
        @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin
    ) { }
    async getOrders() {
        return await this.ordersRepository.find({ relations: ['user', 'address', 'ohp.product.phi'] })
    }
    async getOrdersByClient(id_client: number) {
        return await this.ordersRepository.find({ where: { id_client }, relations: ['user', 'address', 'ohp.product.phi'] })
    }
    async createOrder(order: CreateOrderDto) {
        const userFound = await this.usersRepository.exist({ where: { id: order.id_client } })
        if (!userFound) throw new HttpException("Usuario inexistente.", HttpStatus.NOT_FOUND)
        const addressFound = await this.addressRepository.exist({ where: { id: order.id_address } })
        if (!addressFound) throw new HttpException("Dirección inexistente.", HttpStatus.NOT_FOUND)
        if (order.products == undefined || order.products == null || order.products.length == 0) throw new HttpException("Sin productos.", HttpStatus.NOT_FOUND)
        const productsIds = new Set<number>(order.products.map(prod => prod.id))
        const isProductsExist: boolean[] = []
        for (const id of productsIds) {
            const productFound = await this.productsRepository.exist({ where: { id } })
            isProductsExist.push(productFound)
        }
        if (isProductsExist.includes(false)) throw new HttpException("Algún producto no existe.", HttpStatus.NOT_FOUND)
        const newOrder = this.ordersRepository.create(order)
        const savedOrder = await this.ordersRepository.save(newOrder)
        for (const product of order.products) {
            const ohp = new OrderHasProducts()
            ohp.id_order = savedOrder.id
            ohp.id_product = product.id
            ohp.quantity = product.quantity
            await this.ohpRepository.save(ohp)
        }
        return savedOrder
    }
    async updateOrderStatus(id: number) {
        const orderFound = await this.ordersRepository.findOne({ where: { id }, relations: ['user', 'address', 'ohp'] })
        if (!orderFound) throw new HttpException("Orden inexistente.", HttpStatus.NOT_FOUND)
        const updatedOrder = Object.assign(orderFound, { status: 'PREPARADO' })
        const orderSaved = await this.ordersRepository.save(updatedOrder)
        await this.firebase.messaging.send({
            token: orderSaved.user.notification_token,
            notification: {
                imageUrl: orderSaved.user.img,
                title: `Orden preparada`,
                body: `Hola ${orderSaved.user.name}, te informamos que tu Orden #${orderSaved.id} será entregada a ${orderSaved.address.address} en los proximos minutos.\nGracias por tu compra.`
            }
        })
        return orderSaved
    }
}