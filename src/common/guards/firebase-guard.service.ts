import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ConfigService } from '../modules/config/config.service';
import { FirebaseService } from '../modules/firebase/firebase.service';
import { FirebaseTokenUserData } from '../types/FirebaseTokenUserData';

@Injectable()
export class FirebaseGuard implements CanActivate {
  constructor(
    private firebaseService: FirebaseService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  private async getToken(request: FastifyRequest): Promise<FirebaseTokenUserData> {
    if (!request.headers.authorization) {
      throw new UnauthorizedException('Valid Bearer token missing');
    }
    const [prefix, token] = request.headers.authorization.split(' ');
    if (prefix !== 'Bearer') {
      throw new UnauthorizedException('Valid Bearer token missing');
    } else {
      try {
        const decodedToken = await this.firebaseService.checkToken(token);
        return {
          uid: decodedToken.uid,
          keys: decodedToken.keys,
        };
      } catch (e) {
        throw new UnauthorizedException(e.message);
      }
    }
  }

  private isAdmin(keys: string[], resourceId: string): boolean {
    return keys?.some((key) => key === resourceId);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = await this.getToken(request);
    console.log(token);
    return true;
    // TODO Fix
    // return this.isAdmin(token.keys, this.configService.RESOURCE_ID);
  }
}
