import { IsNotEmpty, IsString, MinLength } from "class-validator"
export class PasswordAuthDto {
    @IsNotEmpty() @IsString() @MinLength(6) oldPassword: string
    @IsNotEmpty() @IsString() @MinLength(6) newPassword: string
}