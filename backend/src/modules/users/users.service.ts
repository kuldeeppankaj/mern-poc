import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  /* ================= CREATE ================= */

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return user.save();
  }

  /* ================= READ ================= */

  // Admin: list all users
  async findAll() {
    return this.userModel
      .find({ isDeleted: false })
      .select('-password')
      .exec();
  }

  // Auth usage only
  async findByEmail(email: string) {
    return this.userModel
      .findOne({ email, isDeleted: false })
      .select('+password')
      .exec();
  }

  async findById(id: string) {
    const user = await this.userModel
      .findOne({ _id: id, isDeleted: false })
      .select('-password')
      .exec();

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /* ================= UPDATE ================= */

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        10,
      );
    }

    const user = await this.userModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        updateUserDto,
        { new: true },
      )
      .select('-password')
      .exec();

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /* ================= STATUS ================= */

  async deactivate(id: string) {
    return this.update(id, { isActive: false });
  }

  async activate(id: string) {
    return this.update(id, { isActive: true });
  }

  /* ================= DELETE ================= */

  // Soft delete (recommended)
  async softDelete(id: string) {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { isDeleted: true, isActive: false },
        { new: true },
      )
      .exec();

    if (!user) throw new NotFoundException('User not found');

    return { message: 'User deleted successfully' };
  }
}
