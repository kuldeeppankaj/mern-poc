import { IsEnum } from 'class-validator';
import { UserRole } from '../../roles/roles.enum';

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
