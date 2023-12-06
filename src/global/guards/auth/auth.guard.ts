import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/global/interfaces/jwtpayload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService
  ) {}
  
  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    console.log(request.headers['authorization']);

    const [type, token] = request.headers['authorization']?.split(' ') ?? [];

    if (type != 'Bearer'){
      throw new UnauthorizedException('No tiene aurotización para acceder aqui');
    }

    try {
      const payload = await this.jwtService
        .verifyAsync<JwtPayload>(
          token, 
          {secret: process.env.JWT_SEED}
        )

      if( !payload.id ){
        throw new UnauthorizedException('No se recibió información de usuario');
      }

      const usuario = await this.authService.findOne(payload.id);
      request['usuario'] = usuario;
    } catch (error: any) {
      throw new UnauthorizedException(error.message);
    }

    return true;
  }
}
