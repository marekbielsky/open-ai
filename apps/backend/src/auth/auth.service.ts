import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async signIn(name: string): Promise<any> {
    const user = await this.usersService.findOne(name);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, name: user.businessName };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}