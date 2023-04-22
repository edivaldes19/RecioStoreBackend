import { Category } from "src/categories/category.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn() id: number
    @Column({ unique: true }) name: string
    @Column() description: string
    @Column({ nullable: true }) img1: string
    @Column({ nullable: true }) img2: string
    @Column() price: number
    @Column() id_category: number
    @JoinColumn({ name: 'id_category' })
    @ManyToOne(() => Category, (category) => category.id) category: Category
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date
}