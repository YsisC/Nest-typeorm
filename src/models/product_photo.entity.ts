import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_photo')
export class ProductPhoto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'photo', type: 'varchar', length: 100 })
  photo: string;

  @ManyToOne((type)=> Product, product => product.id, {cascade: true,
eager: true, nullable: false})
  @JoinColumn({name: 'product_id'})  
  product_id: Product


}