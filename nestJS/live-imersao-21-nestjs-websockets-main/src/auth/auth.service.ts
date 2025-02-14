import { Injectable } from '@nestjs/common';
import { LoginDto } from './login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user || !bcrypt.compareSync(dto.password, user.password)) {
      throw new Error('Invalid Credentials');
    }

    const payload = {
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}
