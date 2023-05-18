import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"
export class LogInAuthDto {
    @IsNotEmpty() @IsString() @IsEmail() email: string
    @IsNotEmpty() @IsString() @MinLength(6) password: string
}