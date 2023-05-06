import { IsNotEmpty, IsString } from "class-validator"

export class CreateOrderDto {
    @IsNotEmpty() id_client: number
    @IsNotEmpty() id_address: number
    @IsNotEmpty() products: Array<{ id_product: number, quantity: number }>
}