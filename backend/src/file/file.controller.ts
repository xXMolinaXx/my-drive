import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Public } from 'src/auth/decorators/public.decorator';
@ApiTags('files')
@Controller('files')
export class FilesController {
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      return { fileName: file.originalname };
    } catch (error) {
      return { fileName: 'error' };
    }
  }
  @Public()
  @Get('getFile/:fileName')
  getFile(@Param('fileName') fileName: string, @Res() res) {
    return res.sendFile(join(process.cwd(), `uploads/${fileName}`));
  }
}
