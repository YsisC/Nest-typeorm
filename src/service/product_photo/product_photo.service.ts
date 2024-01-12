import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProductPhotoDto } from 'src/dto/product_photo.dto';
import { ProductPhoto } from 'src/models/product_photo.entity';
import { Repository } from 'typeorm';

import * as fs from 'fs';


@Injectable()
export class ProductPhotoService {
  constructor(
    @InjectRepository(ProductPhoto)
    private productPhotoRepository: Repository<ProductPhoto>,
  ) {}

  async findAllByProduct(id: number): Promise<ProductPhoto[]> {
    return this.productPhotoRepository.find({
      where: {
        product_id: { id: id },
      },
      order: {
        id: 'desc',
      },
    });
  }

  async insert(dto: ProductPhotoDto) {
    try {
      const productPhoto = this.productPhotoRepository.create(dto);
      this.productPhotoRepository.save(productPhoto);
      return productPhoto;
    } catch (error) {
      throw new HttpException(` Ocurrio un error`, HttpStatus.BAD_REQUEST);
    }
  }

  async delete(id:number)
  {
    let productPhoto= await this.productPhotoRepository.findOne({
       
      where: {
        id: id,
      },
    });
    console.log("product foto",productPhoto)
    if(productPhoto)
    {
      const archivo = productPhoto.photo;
      console.log(archivo)
        fs.unlinkSync(`./assets/uploads/products/${archivo}`);
        await this.productPhotoRepository.remove(productPhoto);
        return {state: 'ok', message: 'Se eliminó el registro exitosamente'}
    }else
    {
      throw new NotFoundException(`No se encuentra la imagen del producto asociado ${id}`);
    }
}
}