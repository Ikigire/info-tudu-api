import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Usuario } from './entities/auth.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {

  constructor(
    @InjectModel( Usuario.name ) private usuarioModel: Model<Usuario>
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    
    try {
      createUsuarioDto.password = bcrypt.hashSync(createUsuarioDto.password, 10)

      const newUsuario = new this.usuarioModel(createUsuarioDto);
      await newUsuario.save();
      const usuario = newUsuario.toJSON();

      return usuario;
    } catch (error) {
      console.log(error);
      if (error.code == 11000){
        throw new BadRequestException(`${createUsuarioDto.email} ya está registrado`);
      }

      throw new InternalServerErrorException('Mi primera chamba');
    }

    //Justo
    //return this.usuarioRepository.insert(createUsuarioDto);
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
