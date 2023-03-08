import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDto } from './dtos/create-user.dto';
import { User, UserDocument } from './schemas';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const isExisting = !!(await this.userModel.findOne({
      name: createUserDto.name
    }));

    if (isExisting) throw new Error('User already exists!');

    return await this.userModel.create({
      ...createUserDto,
      authenticated: true
    });
  }

  async getOne(name: string) {
    return await this.userModel.findOne({ name });
  }

  /** This is just for to mock authentication. In the real world, this should be done in an `AuthService`. */
  async verify(token: string) {
    const user = await this.userModel.findById(token);

    if (user) return user;

    throw new Error('Please, authenticate.');
  }

  async authenticate(name: string, type: 'login' | 'logout') {
    const user = await this.userModel.findOne({ name });

    if (user) {
      user.authenticated = type !== 'logout';
      await user.save();
      return user;
    }

    throw new Error('Record not found.');
  }
}
