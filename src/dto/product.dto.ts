import { Category } from "src/models/category.entity";

export class ProductDto {
    name: string;
    slug?: string;
    price: number;
    description: string;
    stock: number;
    category_id: Category;
}