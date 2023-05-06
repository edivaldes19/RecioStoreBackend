import { Product } from "src/products/product.entity"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
@Entity({ name: 'categories' })
export class Category {
    @PrimaryGeneratedColumn() id: number
    @Column({ unique: true }) name: string
    @Column() description: string
    @Column() img: string
    @OneToMany(() => Product, product => product.id) product: Product
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date
}