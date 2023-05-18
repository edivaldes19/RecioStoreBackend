export class UpdateProductDto {
    name?: string
    description?: string
    price?: number
    id_category?: number
    phi?: { img_url: string }[]
}