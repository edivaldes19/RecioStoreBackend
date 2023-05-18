import { Column, Entity, PrimaryColumn } from "typeorm"
@Entity({ name: 'info' })
export class Info {
    @PrimaryColumn() key: string
    @Column({ unique: true, length: 500 }) value: string
}