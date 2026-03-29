import { Role } from "../enum/role.enum";

export interface Payload {
    id: string;
    role: Role;
    teacherId?: string;
}