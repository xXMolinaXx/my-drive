import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as nodemailer from 'nodemailer';
import { CreateUserDto, UpdateUserDto2 } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/users.schemas';
import { ConfigService } from '@nestjs/config';
import { DNI_REGEX } from 'src/common/regex/dni.regex';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
  ) { }
  async hashPassword(password) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }
  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.findOne({ email: createUserDto.email.trim().toLowerCase() });
    const userFoundWithId = await this.userModel.find({ DNI: createUserDto.DNI }).countDocuments();
    if (user) throw 'Ya existe un usuario con este correo';
    if (userFoundWithId > 1) throw 'Ya existe un cliente cone este numero de identidad';
    // if (!DNI_REGEX.test(createUserDto.DNI)) throw 'El DNI ingresado no tiene un formato de DNI valido';
    const yearBorn = Number(createUserDto.DNI.substring(4, 8));
    const password = await this.hashPassword(createUserDto.password);
    const isSenior = new Date().getFullYear() - yearBorn >= 60;
    const isSuperSenior = new Date().getFullYear() - yearBorn >= 80;
    await new this.userModel({
      bornAt: createUserDto.bornAt,
      DNI: createUserDto.DNI.trim(),
      email: createUserDto.email.trim().toLowerCase(),
      fullName: createUserDto.fullName.trim(),
      gender: createUserDto.gender,
      telphone: '+504' + createUserDto.telphone.trim(),
      password,
      yearBorn,
      senior: isSenior,
      superSenior: isSuperSenior,
    }).save();
  }
  async createStaff(createUserDto: UpdateUserDto2) {
    const user = await this.userModel.findOne({ email: createUserDto.email.trim().toLowerCase() });
    if (user) throw 'Ya existe un usuario con este correo';
    const password = await this.hashPassword(createUserDto.password);
    console.log(createUserDto);
    await new this.userModel({
      email: createUserDto.email.trim().toLowerCase(),
      fullName: createUserDto.fullName.trim(),
      password,
      store: createUserDto.store,
      role: createUserDto.role,
    }).save();
  }
  async readStaff() {
    return await this.userModel.find({ role: { $in: ['flebotomista', 'admin'] } }, { password: 0 }).exec();
  }
  async sendEmail(email: string, subject: string) {
    const user = await this.userModel.findOne({ email: email });

    if (!user) throw 'No existe ningun colaborador con este correo';
    function generateRandomString(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
    const randomString = generateRandomString(10);
    await this.userModel.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPassword: {
            password: randomString,
            expire: new Date().setMinutes(new Date().getMinutes() + 10),
          },
        },
      },
    );
    const emailBody = `
            <div class="email-container">
              <h1>Cambio de contraseña LCM</h1>
              <p>Hola ${user.fullName}</p>
              <p>Haz click en el siguiente link</p>
              <a href="${this.configService.get<string>('URL_RESET_PASSWORD')}/${user._id}/${randomString}">cambiar contraseña</a>
              <p>LCM</p>
            </div>
    `;
    const emailSender = this.configService.get<string>('EMAIL_SENDER');
    const emailSenderPass = this.configService.get<string>('EMAIL_SENDER_PASSWORD');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailSender,
        pass: emailSenderPass,
      },
    });
    const mailOptions = {
      from: emailSender,
      to: email,
      subject: subject,
      html: emailBody,
    };
    await transporter.sendMail(mailOptions);
  }
  findAll() {
    return `This action returns all users`;
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw 'No existe este usuario';
    return user;
  }
  async findUser(search: string) {
    return await this.userModel
      .find({
        $or: [{ fullName: { $regex: search, $options: 'i' } }, { DNI: { $regex: search, $options: 'i' } }, { telphone: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }],
      })
      .exec()
      .then((users) => users.map((user) => user._id));
  }
  async findById(id: string) {
    return await this.userModel.findById(id);
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id);
    if (!user) throw 'Este usuario no existe';
    const isMatch = updateUserDto.hashPassword === user.resetPassword.password;
    if (!isMatch) {
      throw 'No podemos actualizar tu contraseña';
    }
    const newPassword = await this.hashPassword(updateUserDto.password);
    await this.userModel.updateOne(
      { _id: id },
      {
        $set: {
          password: newPassword,
          resetPassword: {
            password: '',
            expired: null,
          },
        },
      },
    );
  }
  async updateStaff(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id);
    if (!user) throw 'Este usuario no existe';
    const newPassword = await this.hashPassword(updateUserDto.password);
    await this.userModel.updateOne(
      { _id: id },
      {
        $set: {
          password: newPassword,
        },
      },
    );
  }
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async findByEmail(email: string) {
    return await this.userModel.findOne({ email: email });
  }
}
