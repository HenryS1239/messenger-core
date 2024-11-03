export { AuthModule } from './auth.module';
export { AuthService } from './auth.service';

export { LocalhostGuard, AdminAuthGuard, UserAppAuthGuard } from './guards';

export interface IAuthUser {
    sub: string;
    _id: string;
    type: string;
    username: string;
    name: string;
    email: string;
}
