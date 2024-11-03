import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthUser } from '@src/imports/auth';
import { CLIENT_IP_HEADER } from '@src/config';

export const RemoteClient = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): { ip: string; token: string; agent: string; headers: string[] } => {
        const request = ctx.switchToHttp().getRequest();
        let ip;
        if (CLIENT_IP_HEADER) {
            ip = request.headers[`${CLIENT_IP_HEADER}`.toLowerCase()];
        }
        if (!ip) {
            ip = request.ip ?? request.connection?.remoteAddress;
        }

        const token = request.headers?.['authorization']?.replace('Bearer ', '');

        return { ip, token, agent: request.headers['user-agent'], headers: request.headers };
    },
);

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext): IAuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});

export const AccessToken = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
    const authorization = ctx.switchToHttp().getRequest()?.headers?.['authorization'];
    return authorization?.replace('Bearer ', '');
});
