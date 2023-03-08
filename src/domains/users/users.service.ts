import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthenticateUserDto } from './dtos';

import { CreateUserDto } from './dtos/create-user.dto';
import { User, UserDocument } from './schemas';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const isExisting = !!(await this.getOne(createUserDto.username));

    if (isExisting) throw new Error('User already exists!');

    return await this.userModel.create({
      ...createUserDto,
      authenticated: true
    });
  }

  async getOne(idOrUsername: string, select?: string) {
    return await this.userModel
      .findOne(
        idOrUsername?.length === 24 && !/\s/.test(idOrUsername)
          ? { _id: idOrUsername }
          : { username: idOrUsername }
      )
      .select(`-orders ${select || ''}`);
  }

  /** This is just for to mock authentication. In the real world, this should be done in an `AuthService`. */
  async verify(token: string) {
    return this.isObjectId(token) ? await this.userModel.findById(token) : null;
  }

  async authenticate(name: string, type: AuthenticateUserDto['type']) {
    const user = await this.getOne(
      name,
      type === 'logout' ? '-username -created_at -updated_at' : undefined
    );

    if (user) {
      user.authenticated = type !== 'logout';
      await user.save();
      return user;
    }

    throw new Error('Record not found.');
  }

  private isObjectId(id: string) {
    return id.length === 24 && !/\s/.test(id);
  }
}
