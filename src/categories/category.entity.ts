import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: 'categories' })
export class Category {
    @PrimaryGeneratedColumn() id: number
    @Column() name: string
    @Column({ unique: true }) description: string
    @Column() img: string
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date
}