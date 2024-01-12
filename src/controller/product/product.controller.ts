import { Controller, Get, Post, Delete, Body, Put , Param, ParseIntPipe} from '@nestjs/common';
import { ProductService } from '../../service/product/product.service';
import { ProductDto } from 'src/dto/product.dto';
import slugify from 'slugify';

@Controller('product')
export class ProductController {

    constructor(private productService: ProductService) {}

    @Get()
    methodGet(): {} {
      return this.productService.findAll();
    }
    @Get('category/:id')
    methodGetByCategory( @Param("id", new ParseIntPipe()) id: number): {} {
      return this.productService.findAllByCategory(id);
    }
  
    @Get(':id')
    methodGetId(@Param() params): {} {
      return this.productService.findOneById(params.id);
    }

    @Post()
    methodPost(@Body() dto: ProductDto) {
      return this.productService.insert(dto);
    }

    @Put(':id')
    methodPut( @Param("id", new ParseIntPipe()) id: number , @Body() dto: ProductDto) {
      this.productService.update(id, {...dto,  slug: slugify(dto.name.toLowerCase())});
      return {estado: "ok", mensaje: "Se modificó el registro exitosamente"}
    }

    @Delete(':id')
    metodoDelete(@Param("id", new ParseIntPipe()) id: number):  Promise<{
      state: string;
      message: string;
  }>{
    return  this.productService.remove(id);
  }
}
