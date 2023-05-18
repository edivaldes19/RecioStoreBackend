import { IsNotEmpty, IsString, MinLength } from "class-validator"
export class CreateInfoDto {
    @IsNotEmpty() @IsString() @MinLength(3) key: string
    @IsNotEmpty() @IsString() value: string
}