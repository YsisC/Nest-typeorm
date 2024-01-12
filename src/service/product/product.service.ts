import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDto } from 'src/dto/product.dto';
import { Product } from 'src/models/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['category_id'],
      order: {
        id: 'desc',
      },
    });
  }

  async findAllByCategory(id: number): Promise<Product[]> {
    return this.productRepository.find({
     where: {
      category_id: {id:id}
     },
      order: {
        id: 'desc',
      },
    });
  }

  async findOneById(id: number): Promise<Product | null> {
    let data = await this.productRepository.findOneBy({
      id,
    });

    if (!data) {
      throw new HttpException(
        {
          estado: HttpStatus.BAD_REQUEST,
          mensaje: 'El registro no existe en el sistema',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: { name: '', message: '' },
        },
      );
    } else {
      return data;
    }
  }

  async insert(dto: ProductDto) {
    let exist = await this.productRepository.findOne({
      where: {
        name: dto.name,
      },
    });
    if (exist) {
      throw new HttpException(
        ` El producto ${dto.name} ya existe`,
        HttpStatus.BAD_REQUEST,
      );
    } else {
      try {
        const product = this.productRepository.create(dto);
        this.productRepository.save(product);
        return product;
      } catch (error) {
        throw new HttpException(` Ocurrio un error`, HttpStatus.BAD_REQUEST);
      }
    }
  }

  update = async (id: number, dto: ProductDto) => {
    if (!id) {
      throw new Error(`update error: id is empty.`);
    }
    const userProduct = {
      id,
      ...dto,
    };

    const product = await this.productRepository.preload(userProduct);
    if (!product) {
      throw new HttpException(
        {
          estado: HttpStatus.BAD_REQUEST,
          mensaje: 'El registro no existe en el sistema',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: { name: '', message: '' },
        },
      );
    } else {
      console.log(product)
      await this.productRepository.save(product);
    }
  };

  async remove(id: number) {
    if (!id) {
      throw new Error(`update error: id is empty.`);
    }
    let existe = await this.productRepository.find({
      where: {
        category_id: { id: id },
      },
    });
   
    if (existe.length >= 1) {
      throw new Error('No es posible eliminar el registro en este momento');
    }
   
    const product = await this.productRepository.findOne({
      where: {
      id: id
      }
    });
    console.log("category",product);
    if (product) {
      await this.productRepository.remove(product);
      return { state: 'ok', message: 'Se eliminó el registro exitosamente' };
    }
    throw new NotFoundException(`No se encuentra el producto ${id}`);
  }

}
