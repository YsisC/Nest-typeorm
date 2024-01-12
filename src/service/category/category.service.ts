import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryDto } from 'src/dto/category.dto';
import { Category } from 'src/models/category.entity';
import { Product } from 'src/models/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Product)
    private repositorio_product: Repository<Product>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      order: {
        id: 'desc',
      },
    });
  }
  async getDato(id: number): Promise<Category | null> {
    let data = await this.categoriesRepository.findOneBy({
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
  async addDato(dto: CategoryDto) {
    let exist = await this.categoriesRepository.findOne({
      where: {
        name: dto.name,
      },
    });
    if (exist) {
      throw new HttpException(
        ` La categoria ${dto.name} ya existe`,
        HttpStatus.BAD_REQUEST,
      );
    } else {
      try {
        let save = this.categoriesRepository.create(dto);
        return this.categoriesRepository.save(save);
      } catch (error) {
        throw new HttpException(` Ocurrio un error`, HttpStatus.BAD_REQUEST);
      }
    }
  }

  updateDatos = async (id: number, dto: CategoryDto) => {
    if (!id) {
      throw new Error(`update error: id is empty.`);
    }
    const userCategory = {
      id,
      ...dto,
    };

    const category = await this.categoriesRepository.preload(userCategory);
    if (!category) {
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
      await this.categoriesRepository.save(category);
    }
  };

  async remove(id: number) {
    if (!id) {
      throw new Error(`update error: id is empty.`);
    }
    let existe = await this.repositorio_product.find({
      where: {
        category_id: { id: id },
      },
    });
   
    if (existe.length >= 1) {
      throw new Error('No es posible eliminar el registro en este momento');
    }
   
    const category = await this.categoriesRepository.findOne({
      where: {
      id: id
      }
    });
    console.log("category",category);
    if (category) {
      await this.categoriesRepository.remove(category);
      return { estado: 'ok', mensaje: 'Se eliminó el registro exitosamente' };
    }
    throw new NotFoundException(`No se encuentra el producto ${id}`);
  }
}
