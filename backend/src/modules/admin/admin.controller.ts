import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { UserRole } from '../roles/roles.enum';

@Controller('admin')
export class AdminController {
  constructor(private usersService: UsersService) {}

  // 🔒 ADMIN → Create Public User
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('users')
  async adminCreateUser(@Body() dto: CreateUserDto) {
    return this.usersService.create({
      ...dto,
      role: UserRole.CUSTOMER,
    });
  }
}
