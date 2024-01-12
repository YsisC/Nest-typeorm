import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';
import slugify from 'slugify';
import { Category } from './category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ unique: true, name: 'slug', type: 'varchar', length: 100 })
  slug: string;

  @Column({ name: 'price'})
  price: number;

  @Column({  name: 'description', type: 'longtext' })
  description: string;

  @Column({ name: 'stock'})
  stock: number;

  @ManyToOne((type)=> Category, category => category.id, {cascade: true,
eager: true, nullable: false})
  @JoinColumn({name: 'category_id'})  
  category_id: Category

  @BeforeInsert()
  toCreate() {
    this.slug = slugify(this.name.toLocaleLowerCase());
  }
}
