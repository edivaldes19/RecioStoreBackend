import { Category } from "src/categories/category.entity"
import { OrderHasProducts } from "src/orders/order_has_products.entity"
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { ProductHasImages } from "./product_has_images.entity"
@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn() id: number
    @Column({ unique: true }) name: string
    @Column() description: string
    @Column({ default: 0.0 }) price: number
    @Column() id_category: number
    @ManyToOne(() => Category, category => category.id, { onUpdate: 'CASCADE', onDelete: 'CASCADE' }) @JoinColumn({ name: 'id_category' }) category: Category
    @OneToMany(() => OrderHasProducts, ohp => ohp.product) @JoinColumn({ referencedColumnName: 'id_product' }) ohp: OrderHasProducts[]
    @OneToMany(() => ProductHasImages, phi => phi.product) @JoinColumn({ referencedColumnName: 'id_product' }) phi: ProductHasImages[]
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date
}