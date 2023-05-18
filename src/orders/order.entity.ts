import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Address } from "src/address/address.entity"
import { User } from "src/users/users.entity"
import { OrderHasProducts } from "./order_has_products.entity"
@Entity({ name: 'orders' })
export class Order {
    @PrimaryGeneratedColumn() id: number
    @Column() id_client: number
    @Column() id_address: number
    @Column({ default: 'PAGADO' }) status: string
    @ManyToOne(() => User, user => user.id, { onUpdate: 'CASCADE', onDelete: 'CASCADE' }) @JoinColumn({ name: 'id_client' }) user: User
    @ManyToOne(() => Address, address => address.id, { onUpdate: 'CASCADE', onDelete: 'CASCADE' }) @JoinColumn({ name: 'id_address' }) address: Address
    @OneToMany(() => OrderHasProducts, ohp => ohp.order) @JoinColumn({ referencedColumnName: 'id_order' }) ohp: OrderHasProducts[]
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date
}