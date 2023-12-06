import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from 'src/global/guards/auth/auth.guard';
import { LoginResponse } from './interfaces/login-response.interface';
import { Usuario } from './entities/auth.entity';
import { createJwt } from 'src/global/tools/create-jwt.tool';
import { JwtService } from '@nestjs/jwt';
import { ListResponse } from './interfaces/list-response.interface';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService
  ) {}

  @Post()
  async create(@Body() createAuthDto: CreateUsuarioDto): Promise<Usuario> {
    // Para habilitar inicio de sesión al momento de crear usuario
    // const usuario = await this.authService.create(createAuthDto);
    // return {
    //   usuario,
    //   token: ''
    // }
    return this.authService.create(createAuthDto);
  }

  @Post('/login')
  async login( @Body() loginDto: LoginDto ): Promise<LoginResponse> {
    const usuario = await this.authService.login( loginDto );
    return {
      usuario,
      token: createJwt({id: usuario._id}, this.jwtService)
    }
  }

  @UseGuards( AuthGuard )
  @Get()
  async findAll( @Request() req: Request ): Promise<ListResponse> {
    const usuarios = await this.authService.findAll();
    
    const usuarioLogeado = req['usuario'] as Usuario;
    
    return {
      users: usuarios,
      token: createJwt({id: usuarioLogeado._id}, this.jwtService)
    }
  }

  @UseGuards( AuthGuard )
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: Request): Promise<LoginResponse> {
    const usuario = await this.authService.findOne(id);
    const usuarioLogeado = req['usuario'] as Usuario;

    return {
      usuario,
      token: createJwt({id: usuarioLogeado._id}, this.jwtService)
    }
  }

  @UseGuards( AuthGuard )
  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateAuthDto: UpdateAuthDto, 
    @Request() req : Request
  ): Promise<LoginResponse> {
    const usuario = await this.authService.update(id, updateAuthDto);

    const usuarioLogueado = req['usuario'] as Usuario;

    return {
      usuario,
      token: createJwt({id: usuarioLogueado._id}, this.jwtService)
    }
  }

  @UseGuards( AuthGuard )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}


