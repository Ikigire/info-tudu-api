import { Usuario } from "../entities/auth.entity";

export interface ListResponse {
    users: Usuario[],
    token: string
}