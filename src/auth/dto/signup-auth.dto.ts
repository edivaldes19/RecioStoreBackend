import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"
export class SignUpAuthDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    name: string

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    surname: string

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    phone: string

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string
    rolesIds: string[]
}