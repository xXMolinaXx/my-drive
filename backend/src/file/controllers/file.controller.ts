import { Body, Controller, Get, HttpStatus, Param, Post, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Public } from 'src/auth/decorators/public.decorator';
import { IhttpResponse } from 'src/common/interface/httpResponse/httpResponse.interface';
import { FileService } from '../services/file.service';
import { UpdateFileDTO, UploadFileDTO } from '../DTOS/files.dto';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ERoles } from 'src/common/enums/roles.enum';
import { jwtDecode } from 'jwt-decode';
@ApiTags('files')
@Controller('files')
@UseGuards(ApiKeyGuard, RolesGuard)
export class FilesController {
  constructor(private readonly fileService: FileService) {}
  @Roles(ERoles.USER, ERoles.ADMIN)
  @Get('/:userId')
  async getUserFiles(@Param('userId') userId: string): Promise<IhttpResponse> {
    try {
      return {
        message: '',
        success: true,
        statusCode: 200,
        data: await this.fileService.getUserFile(userId),
      };
    } catch (error) {
      return {
        message: 'Error al cargar archivos',
        success: false,
        statusCode: 500,
      };
    }
  }
  @Roles(ERoles.USER, ERoles.ADMIN)
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
  uploadFile(@UploadedFile() file: Express.Multer.File, @Param('imageName') image: string, @Body('userId') userId: string): IhttpResponse {
    try {
      const data: UploadFileDTO = {
        ...file,
        userId,
      };
      this.fileService.uploadInfoFile(data);
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
  @Public()
  // @Roles(ERoles.ADMIN, ERoles.USER)
  @Get('/download/:filename')
  async DownloadExcel(@Request() req, @Res() res: Response, @Param('filename') filename: string): Promise<void> {
    try {
      const imageData = await this.fileService.getImage(filename);
      const userAccess = imageData.userAccess.map((el) => String(el));
      let decoded: any = {
        sub: '',
      };
      if (req.headers.authorization) {
        decoded = jwtDecode(req.headers.authorization);
      }

      if (imageData.isPublic || decoded.sub === String(imageData.userOwner) || userAccess.includes(decoded.sub)) {
        const filePath = join(process.cwd(), imageData.path);
        res.setHeader('Content-Disposition', `attachment; filename=${imageData.filename}`);
        res.setHeader('Content-Type', 'application/octet-stream');

        const fileStream = fs.createReadStream(filePath);
        fileStream.on('open', () => {
          fileStream.pipe(res);
        });
        fileStream.on('error', () => {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error al descargar el Excel',
            success: false,
          });
        });
      } else {
        throw 'No tienes acceso';
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: typeof error === 'string' ? error : 'Error en el sistema',
        success: false,
      });
    }
  }
  @Post('/configurations')
  // @Roles(ERoles.ADMIN, ERoles.USER)
  async configureFile(@Body() body: UpdateFileDTO): Promise<IhttpResponse> {
    try {
      await this.fileService.updateFileConfig(body);
      return {
        message: '',
        success: true,
        statusCode: 200,
        data: [],
      };
    } catch (error) {
      return {
        message: '',
        success: false,
        statusCode: 500,
      };
    }
  }
}
