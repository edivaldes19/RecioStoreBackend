import { IsNotEmpty, IsString, MinLength } from "class-validator"
export class CreateAddressDto {
    @IsNotEmpty() @IsString() @MinLength(5) address: string
    @IsNotEmpty() @IsString() @MinLength(5) neighborhood: string
    @IsNotEmpty() id_user: number
}