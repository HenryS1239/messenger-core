import { Body, Controller, Get, Logger, NotFoundException, Post, UnauthorizedException, UseGuards } from '@nestjs/common';

import { UserAppAuthGuard, AuthService } from '@src/imports/auth';
import { DatabaseService } from '@src/imports/database';
import { AccessToken, RemoteClient, User } from '@src/decorations';
import { SyslogService } from '@src/imports/logger';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDTO, RegisterFCMTokenDTO } from './dto/auth.dto';

@ApiTags('Common:Auth')
@Controller('/api/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly auth: AuthService, private readonly database: DatabaseService, private readonly syslog: SyslogService) {}

    @Post('login')
    async login(@Body() body: LoginDTO, @RemoteClient() client) {
        const { email, password } = body;

        let user: any;
        try {
            user = await this.auth.user.attempt({ email, password });
        } catch (err) {
            throw new UnauthorizedException(err.message);
        }

        if (!user) {
            this.syslog.audit.notice(`user ${email} failed attempt login failed from ${client.ip}`);
            throw new UnauthorizedException();
        }

        this.syslog.audit.info(`user ${email} success login from ${client.ip}`);

        return {
            token: await this.auth.user.sign(user),
        };
    }

    @ApiBearerAuth()
    @Get('profile')
    @UseGuards(UserAppAuthGuard)
    async getProfile(@User() usr) {
        return await this.database.User.findOne({ _id: usr._id }).populate('role');
    }

    @ApiBearerAuth()
    @Post('fcm')
    @UseGuards(UserAppAuthGuard)
    async registerFCMToken(@User() usr, @Body() body: RegisterFCMTokenDTO) {
        const user = await this.database.User.findOne({ _id: usr._id });
        if (!user) {
            throw new NotFoundException(`User not found.`);
        }
        user.registrationTokens = body.fcmToken;

        await user.save();
        return user;
    }

    @ApiBearerAuth()
    @Post('opt-in-out')
    @UseGuards(UserAppAuthGuard)
    async optInNotification(@User() usr) {
        const user = await this.database.User.findOne({ _id: usr._id });
        if (!user) {
            throw new NotFoundException(`User not found.`);
        }
        user.isNotification = !user.isNotification;

        await user.save();
        return user;
    }

    @ApiBearerAuth()
    @Get('logout')
    async logout(@AccessToken() token) {
        return { success: await this.auth.token(token).void() };
    }
}
