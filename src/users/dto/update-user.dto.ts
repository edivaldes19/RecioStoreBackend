import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"
export class UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    name?: string

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    surname?: string

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    phone?: string
    notification_token?: string
}