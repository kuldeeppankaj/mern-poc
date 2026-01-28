import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { UserRole } from '../roles/roles.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /* ================= CREATE ================= */

  // Admin creates CUSTOMER user
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create({
      ...dto,
      role: UserRole.CUSTOMER,
    });
  }

  /* ================= READ ================= */

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  /* ================= UPDATE ================= */

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  /* ================= STATUS ================= */

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }

  /* ================= DELETE ================= */

  // Soft delete
  @Patch(':id/delete')
  @Roles(UserRole.ADMIN)
  delete(@Param('id') id: string) {
    return this.usersService.softDelete(id);
  }
}
