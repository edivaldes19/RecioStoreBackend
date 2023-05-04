import { User } from "src/users/users.entity"
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
@Entity({ name: 'address' })
export class Address {
    @PrimaryGeneratedColumn() id: number
    @Column() address: string
    @Column() neighborhood: string
    @Column() id_user: number
    @ManyToOne(() => User, user => user.id) @JoinColumn({ name: 'id_user' }) user: User
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date
}