import { IsNotEmpty, IsString, IsUrl, MinLength } from "class-validator"
export class CreateCategoryDto {
    @IsNotEmpty() @IsString() @MinLength(5) name: string
    @IsNotEmpty() @IsString() @MinLength(5) description: string
    @IsNotEmpty() @IsString() @IsUrl() img: string
}