import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Put,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { ProductPhotoService } from '../../service/product_photo/product_photo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Product } from 'src/models/product.entity';
import { nameFile } from 'src/helpers/helpers';

export class SampleDto {
  product_id: Product;
}
export const storage = diskStorage({
  destination: './assets/uploads/products',
  filename: (req, file, callback) => {
  
    callback(null,  nameFile(file.originalname));
  },
});

export const dateCreate = Date.now();

@Controller('product-photo')
export class ProductPhotoController {
  constructor(private productPhotoService: ProductPhotoService) {}

  @Get(':id')
  methodGetByCategory(@Param('id', new ParseIntPipe()) id: number): {} {
    return this.productPhotoService.findAllByProduct(id);
  }

    @Post()
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadFile(
    @Body() dto: SampleDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
  
    this.productPhotoService.insert({
      photo: file.filename,
      product_id: dto.product_id,
    });
    return { state: 'ok', message: 'Se creo el registro exitosamente' };
  }

  @Delete(':id')
  metodoDelete(@Param('id', new ParseIntPipe()) id: number) {
    return this.productPhotoService.delete(id);
  }
}
