import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { Order } from "./order.entity"
import { Product } from "src/products/product.entity"
@Entity({ name: 'order_has_products' })
export class OrderHasProducts {
    @PrimaryColumn() id_order: number
    @PrimaryColumn() id_product: number
    @Column() quantity: number
    @ManyToOne(() => Order, order => order.id, { onUpdate: 'CASCADE', onDelete: 'CASCADE' }) @JoinColumn({ name: 'id_order' }) order: Order
    @ManyToOne(() => Product, product => product.id, { onUpdate: 'CASCADE', onDelete: 'CASCADE' }) @JoinColumn({ name: 'id_product' }) product: Product
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date
}