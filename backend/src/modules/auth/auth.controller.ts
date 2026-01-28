import { Body, Controller, Post, Param, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { UserRole } from '../roles/roles.enum';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

 @Post('login')
async login(@Body() dto: LoginDto) {
  // Step 1: Validate user (email + password)
  const user = await this.authService.validateUser(dto.email, dto.password);

  // Step 2: Return login response (includes token if admin)
  return this.authService.login(user);
}


  // 🔐 ADMIN → login as user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('login-as-user/:id')
  async adminLoginAsUser(@Param('id') userId: string) {
    const user = await this.usersService.findById(userId);

    return {
      message: 'Logged in as user',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
