export class UpdateProductDto {
    name?: string
    description?: string
    img1?: string
    img2?: string
    price?: number
    images_to_update?: Array<number>
    id_category?: number
}