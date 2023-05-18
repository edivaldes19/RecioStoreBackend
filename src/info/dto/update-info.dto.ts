import { IsNotEmpty, IsString, MinLength } from "class-validator"
export class UpdateInfoDto { @IsNotEmpty() @IsString() value: string }