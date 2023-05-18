import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { Product } from "src/products/product.entity"
@Entity({ name: 'product_has_images' })
export class ProductHasImages {
    @PrimaryGeneratedColumn() id: number
    @PrimaryColumn() id_product: number
    @Column() img_url: string
    @ManyToOne(() => Product, product => product.id, { onUpdate: 'CASCADE', onDelete: 'CASCADE' }) @JoinColumn({ name: 'id_product' }) product: Product
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date
}