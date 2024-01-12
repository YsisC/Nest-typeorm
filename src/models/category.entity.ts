import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import slugify from 'slugify';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ unique: true, name: 'slug', type: 'varchar', length: 100 })
  slug: string;

  @BeforeInsert()
  toCreate() {
    this.slug = slugify(this.name);
  }
}
