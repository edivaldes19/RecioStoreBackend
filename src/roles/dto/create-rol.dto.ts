import { IsNotEmpty, IsString, IsUrl, MinLength } from 'class-validator'
export class CreateRolDto {
    @IsNotEmpty() @IsString() id: string
    @IsNotEmpty() @IsString() @MinLength(5) name: string
    @IsNotEmpty() @IsString() @IsUrl() img: string
    @IsNotEmpty() @IsString() route: string
}