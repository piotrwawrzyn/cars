import {
  BadRequestException,
  UnauthorizedException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signUp(email: string, password: string) {
    // See if email is in use
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // Hash the users password
    const salt = randomBytes(8).toString('hex');
    const hashBuffer = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hashBuffer.toString('hex');

    // Create a new user and save it
    const user = this.usersService.create(email, result);

    return user;
  }

  async signIn(email: string, password: string) {
    // Find the user
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('email does not exist');
    }

    // Get user's salt and hash
    const [salt, storedHash] = user.password.split('.');

    // Create new salted hash and compare it against stored hash
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex'))
      throw new UnauthorizedException('bad password');

    return user;
  }
}
