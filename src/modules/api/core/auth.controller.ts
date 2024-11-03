import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Logger,
    NotAcceptableException,
    NotFoundException,
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
import { ForgetPasswordDTO, LoginDTO, ResetPasswordDTO, UpdatePasswordDTO } from '@src/modules/api/core/dto/auth.dto';

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

    @ApiBearerAuth()
    @Put('profile')
    @UseGuards(AdminAuthGuard)
    async updateProfile(@User() usr, @Body() body) {
        const user = await this.database.User.findOne({ _id: usr._id });
        if (user) {
            ['name', 'email', 'contact'].forEach((k) => {
                if (body.hasOwnProperty(k)) {
                    user[k] = body[k];
                }
            });
            await user.save();
            return { success: true };
        }
        throw new NotFoundException();
    }

    @ApiBearerAuth()
    @Post('forget-password')
    async forgetPassword(@RemoteClient() client, @Body() body: ForgetPasswordDTO) {
        if (!body.email) {
            throw new NotAcceptableException(`invalid params`);
        }

        const user = await this.database.User.findOne({
            email: body.email,
            deletedAt: null,
        });
        if (!user) {
            throw new NotAcceptableException(`invalid username or email`);
        }

        if (!user.email) {
            throw new NotAcceptableException(`Your account hasn't configured email yet, please contact system admin for password reset.`);
        }

        await this.auth.user.forgetPassword.generate(user._id);

        this.logger.verbose(`user ${user.username} requested forgot password from ip ${client.ip}`);
        this.syslog.audit.notice(`user ${user.name} requested forget password from ip ${client.ip}`, { client });

        return { success: true, email: user.email };
    }

    @ApiBearerAuth()
    @Post('reset-password')
    async updateResetPassword(@Body() body: ResetPasswordDTO, @RemoteClient() client) {
        const { email, token, password } = body;
        if (email && token && password) {
            const user = await this.database.User.findOne({ email, deletedAt: null });
            if (user) {
                await this.auth.user.forgetPassword.validate(user._id, token);
                user.password = password;
                user.forgetPasswordExpiry = new Date();
                user.forgetPasswordPasscode = null;
                await user.save();

                this.logger.verbose(`${email} success reset password from ip ${client.ip}`);
                this.syslog.audit.notice(`${email} success reset password from ip ${client.ip}`, { client });
                return { success: true };
            } else {
                throw new NotAcceptableException(`invalid user`);
            }
        }
        throw new NotAcceptableException(`missing require input params.`);
    }
}
