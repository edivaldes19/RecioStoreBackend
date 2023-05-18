import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToMany, JoinTable, OneToMany } from "typeorm"
import { hash } from "bcrypt"
import { Role } from "src/roles/rol.entity"
import { Address } from "src/address/address.entity"
import { Order } from "src/orders/order.entity"
@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn() id: number
    @Column() name: string
    @Column() surname: string
    @Column({ unique: true }) phone: string
    @Column({ unique: true }) email: string
    @Column() password: string
    @Column({ nullable: true }) img: string
    @Column({ nullable: true }) notification_token: string
    @JoinTable(
        {
            name: 'user_has_roles',
            joinColumn: { name: 'id_user' },
            inverseJoinColumn: { name: 'id_rol' }
        }
    )
    @ManyToMany(() => Role, rol => rol.users) roles: Role[]
    @OneToMany(() => Address, address => address.id) address: Address
    @OneToMany(() => Order, order => order.id) order: Order
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date
    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, Number(process.env.HASH_SALT))
    }
}