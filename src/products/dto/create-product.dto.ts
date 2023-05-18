import { IsNotEmpty, IsString, MinLength } from "class-validator"
export class CreateProductDto {
    @IsNotEmpty() @IsString() @MinLength(5) name: string
    @IsNotEmpty() @IsString() @MinLength(5) description: string
    @IsNotEmpty() price: number
    @IsNotEmpty() id_category: number
    @IsNotEmpty() phi: { img_url: string }[]
}