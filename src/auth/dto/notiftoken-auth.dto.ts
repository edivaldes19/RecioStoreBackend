import { IsNotEmpty, IsString } from "class-validator"
export class NotifTokenAuthDto {
    @IsNotEmpty() @IsString() notification_token: string
}