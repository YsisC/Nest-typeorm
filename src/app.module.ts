import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Category } from './models/category.entity';
import { Product } from './models/product.entity';
import { ProductPhoto } from './models/product_photo.entity';
import { CategoryService } from './service/category/category.service';
import { ProductService } from './service/product/product.service';
import { ProductController } from './controller/product/product.controller';
import { CategoryController } from './controller/category/category.controller';
import { ProductPhotoController } from './controller/product_photo/product_photo.controller';
import { ProductPhotoService } from './service/product_photo/product_photo.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets'),
    }),
ConfigModule.forRoot(),
TypeOrmModule.forFeature([Category, Product, ProductPhoto]),
TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DATABASE_SERVER,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  entities: [],
  synchronize: true,
  autoLoadEntities: true
}),
  ],
  controllers: [AppController, ProductController, CategoryController, ProductPhotoController],
  providers: [AppService, CategoryService, ProductService, ProductPhotoService],
})
export class AppModule {}
