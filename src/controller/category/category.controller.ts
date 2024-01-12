import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CategoryDto } from 'src/dto/category.dto';
import { CategoryService } from 'src/service/category/category.service';
import slugify from 'slugify';


@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  methodGet(): {} {
    return this.categoryService.findAll();
  }

  @Get(':id')
  methodGetId(@Param() params): {} {
    return this.categoryService.getDato(params.id);
  }

  @Post()
  methodPost(@Body() dto: CategoryDto) {
    return this.categoryService.addDato(dto);
  }

  @Put(':id')
  metodoPut( @Param("id", new ParseIntPipe()) id: number, @Body() dto: CategoryDto)
  {
  
      
      this.categoryService.updateDatos(id, {name: dto.name, slug: slugify(dto.name.toLowerCase())});
      return {estado: "ok", mensaje: "Se modificó el registro exitosamente"}
    

  }
  @Delete(':id')
  metodoDelete(@Param("id", new ParseIntPipe()) id: number):  Promise<{
    estado: string;
    mensaje: string;
}>
  {
     return  this.categoryService.remove(id);
  }
}
