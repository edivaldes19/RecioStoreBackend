import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm"
import { User } from '../users/users.entity'
@Entity({ name: 'roles' })
export class Role {
    @PrimaryColumn() id: string
    @Column({ unique: true }) name: string
    @Column() img: string
    @Column({ unique: true }) route: string
    @ManyToMany(() => User, user => user.roles) users: User[]
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date
}