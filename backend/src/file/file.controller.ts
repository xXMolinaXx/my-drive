import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Public } from 'src/auth/decorators/public.decorator';
import { IhttpResponse } from 'src/common/interface/httpResponse/httpResponse.interface';
@ApiTags('files')
@Controller('files')
export class FilesController {
  @Post('upload/:imageName')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${req.params.imageName}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Param('imageName') image: string): IhttpResponse {
    try {
      return {
        message: 'Imagen actualizada',
        success: true,
        statusCode: 200,
        data: { fileName: image },
      };
    } catch (error) {
      return {
        error: error.toString(),
        message: 'error al subir image',
        success: false,
      };
    }
  }
  @Public()
  @Get('getFile/:fileName')
  getFile(@Param('fileName') fileName: string, @Res() res) {
    return res.sendFile(join(process.cwd(), `uploads/${fileName}`));
  }
}
