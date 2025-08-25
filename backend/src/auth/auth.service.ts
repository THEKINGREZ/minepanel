import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // Credenciales hardcodeadas para admin
  private readonly users = [
    {
      userId: 1,
      username: 'admin',
      password: '$2b$10$Y4NqWhUoeQ5lVSu3Wwm06..zQuGmw8I.CZM/fcIIHT/K58k.4JlrC',
    },
  ];

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    if (username === this.configService.get('CLIENT_USERNAME') && (await bcrypt.compare(password, this.configService.get('CLIENT_PASSWORD')))) {
      return { userId: 1, username: username };
    }

    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
      username: user.username,
    };
  }

  // Helper method to generate password hash
  // Only used in development to generate the initial hash
  async generateHash(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
