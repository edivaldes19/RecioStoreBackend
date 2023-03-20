export class CreateUserDto {
    name: string
    surname: string
    phone: string
    email: string
    password: string
    img?: string
    notification_token?: string
}