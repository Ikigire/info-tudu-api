import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from 'src/global/guards/auth/auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateUsuarioDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('/login')
  login( @Body() loginDto: LoginDto ) {
    return this.authService.login( loginDto );
  }

  @UseGuards( AuthGuard )
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @UseGuards( AuthGuard )
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @UseGuards( AuthGuard )
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @UseGuards( AuthGuard )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
