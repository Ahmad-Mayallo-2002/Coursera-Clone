import { Role } from '../enum/role.enum';

export interface Login {
  refreshToken: string;
  accessToken: string;
  id: string;
  role: Role;
}
