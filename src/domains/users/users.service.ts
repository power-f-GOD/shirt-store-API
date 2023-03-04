import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);

    return await user.save();
  }

  async getOne(name: string) {
    return await this.userModel.findOne({ name }).exec();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  /** This is just for to mock authentication. In the real world, this should be done in an `AuthService`. */
  async verify(token: string) {
    const user = await this.userModel.findById(token);

    if (user) return user;

    throw new Error('Please, authenticate.');
  }
}
