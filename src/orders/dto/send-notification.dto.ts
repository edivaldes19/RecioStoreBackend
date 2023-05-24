import { IsNotEmpty, IsString } from "class-validator"
export class SendNotificationDto {
    @IsNotEmpty() @IsString() title: string
    @IsNotEmpty() @IsString() body: string
    @IsNotEmpty() @IsString() id_notification: string
}