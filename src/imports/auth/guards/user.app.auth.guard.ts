import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PLATFORM } from '@src/constants';
@Injectable()
export class UserAppAuthGuard implements CanActivate {
    constructor(private readonly auth: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<any> {
        const authorization = context.switchToHttp().getRequest()?.headers?.['authorization'];
        if (authorization && (await this.auth.token(authorization).banned())) {
            throw new UnauthorizedException(`banned token`);
        }

        const user = await this.auth.user.validate(authorization);

        if (user.isDisabled) {
            throw new UnauthorizedException(`Account is disabled`);
        }

        context.switchToHttp().getRequest().user = user;

        return !!user;
    }
}
