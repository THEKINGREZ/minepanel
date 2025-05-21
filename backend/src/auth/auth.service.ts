import { Injectable } from '@nestjs/common';
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

  constructor(private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = this.users.find((user) => user.username === username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
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

  // Método auxiliar para generar hash de una contraseña
  // Solo se usa en desarrollo para generar el hash inicial
  async generateHash(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
