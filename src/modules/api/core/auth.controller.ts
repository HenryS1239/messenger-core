import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Logger,
    NotAcceptableException,
    NotFoundException,
    Param,
    Post,
    Put,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';

import { AdminAuthGuard, AuthService } from '@src/imports/auth';
import { DatabaseService } from '@src/imports/database';
import { AccessToken, RemoteClient, User } from '@src/decorations';
import { SyslogService } from '@src/imports/logger';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDTO, RegisterFCMTokenDTO, UpdatePasswordDTO } from '@src/modules/api/core/dto/auth.dto';

@ApiTags('Core:Auth')
@Controller('/api/core/auth')
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
    @UseGuards(AdminAuthGuard)
    async getProfile(@User() usr) {
        return await this.database.User.findOne({ _id: usr._id }).populate('role');
    }

    @ApiBearerAuth()
    @Post('fcm')
    @UseGuards(AdminAuthGuard)
    async registerFCMToken(@User() usr, @Body() body: RegisterFCMTokenDTO) {
        const user = await this.database.User.findOne({ _id: usr._id });
        if (!user) {
            throw new NotFoundException(`User not found.`);
        }
        user.registrationTokens = body.fcmToken;
        user.isNotification = true;

        await user.save();
        return user;
    }

    @ApiBearerAuth()
    @Get('logout')
    async logout(@AccessToken() token) {
        return { success: await this.auth.token(token).void() };
    }

    @ApiBearerAuth()
    @Put('password')
    @UseGuards(AdminAuthGuard)
    async updatePassword(@User() usr, @Body() body: UpdatePasswordDTO, @RemoteClient() client) {
        const user = await this.database.User.findOne({ _id: usr._id });
        if (!user) {
            throw new NotFoundException(`Data not found.`);
        }

        const { current, password } = body;
        const ok = await this.auth.user.attempt({
            email: user.email,
            password: current,
        });
        if (ok) {
            user.password = password;
            await user.save();
            this.syslog.audit.info(`user ${user.email} updated own password from ${client.ip}`);
            return { success: true };
        }
        throw new ForbiddenException();
    }
}
