import { IsEmail, IsEnum, IsOptional, MinLength, IsString } from 'class-validator';
import { UserRole } from '../../roles/roles.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
