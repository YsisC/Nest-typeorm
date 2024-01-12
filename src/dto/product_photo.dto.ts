import { Product } from "src/models/product.entity";

export class ProductPhotoDto {
    photo: string;
    product_id: Product;
}