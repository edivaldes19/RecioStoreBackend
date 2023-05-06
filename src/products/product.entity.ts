import { Category } from "src/categories/category.entity"
import { OrderHasProducts } from "src/orders/order_has_products.entity"
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn() id: number
    @Column({ unique: true }) name: string
    @Column() description: string
    @Column({ nullable: true }) img1: string
    @Column({ nullable: true }) img2: string
    @Column() price: number
    @Column() id_category: number
    @ManyToOne(() => Category, category => category.id, { onUpdate: 'CASCADE', onDelete: 'CASCADE' }) @JoinColumn({ name: 'id_category' }) category: Category
    @OneToMany(() => OrderHasProducts, ohp => ohp.product) @JoinColumn({ referencedColumnName: 'id_order' }) ohp: OrderHasProducts[]
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date
}