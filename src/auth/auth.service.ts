import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Usuario } from './entities/auth.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from "bcrypt";
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './interfaces/login-response.interface';
import { createJwt } from 'src/global/tools/create-jwt.tool';
import { JwtService } from '@nestjs/jwt';
import { ListResponse } from './interfaces/list-response.interface';
import { find } from 'rxjs';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel( Usuario.name ) private usuarioModel: Model<Usuario>,
    private jwtService: JwtService
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

  async login( loginDto: LoginDto ): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const usuario = await this.usuarioModel.findOne( 
      {
        //email: email
        //email: 'abc@def.com'
        email
      }
     );

     //Justo 
     // const usuario = await this.usersRepository.findOneBy({ email: email });

    if (!usuario) {
      throw new NotFoundException(`No se encontró usuario con el email ${email}`);
    }

    if ( !bcrypt.compareSync( password, usuario.password ) ){
      throw new UnauthorizedException('La contraseña del usuario es icorrecta');
    }

    const { password:_, ...user } = usuario.toJSON();

    return {
      usuario: user,
      token: createJwt(
        {
          id: usuario.id
        },
        this.jwtService
      )
    };
  }

  async findAll(): Promise<Usuario[]> {
    const usuarios = await this.usuarioModel.find();
    return usuarios.map( usuario => {
      const { password, ...rest } = usuario.toJSON();
      return rest;
    } );
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioModel.findById(id);
    const { password, ...rest } = usuario.toJSON();
    return rest;
  }

  async update(id: string, usuario: UpdateAuthDto) {
    await this.usuarioModel.updateOne({id }, usuario);
    
    return this.findOne(id);
  }

  async remove(id: string) {
    // Hacer baja lógica
    return this.findOne(id);
  }
}
