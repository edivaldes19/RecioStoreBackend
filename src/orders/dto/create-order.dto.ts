import { IsNotEmpty } from "class-validator"
export class CreateOrderDto {
    @IsNotEmpty() id_client: number
    @IsNotEmpty() id_address: number
    @IsNotEmpty() products: { id: number, quantity: number }[]
}