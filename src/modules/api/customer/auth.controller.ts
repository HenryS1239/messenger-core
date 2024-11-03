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
import { UserAppAuthGuard, AuthService } from '@src/imports/auth';
import { DatabaseService } from '@src/imports/database';
import { AccessToken, RemoteClient, User } from '@src/decorations';
import { PLATFORM } from '@src/constants';
import { SyslogService } from '@src/imports/logger';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ForgetPasswordDTO, LoginDTO, ResetPasswordDTO, UpdatePasswordDTO } from '@src/modules/api/core/dto/auth.dto';
import { UpdateProfileAppDTO } from '@src/modules/api/customer/dto/auth.dto';

@ApiTags('Customer:Auth')
@Controller('/api/customer/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly auth: AuthService, private readonly database: DatabaseService, private readonly syslog: SyslogService) {}

    @Post('login')
    async login(@Body() body: LoginDTO, @RemoteClient() client) {
        const { email, password } = body;

        let user: any;
        try {
            user = await this.auth.user.attempt({ email, password, platform: PLATFORM.APP });
        } catch (err) {
            throw new UnauthorizedException(err.message);
        }

        if (!user) {
            this.syslog.audit.notice(`user ${email} failed attempt login failed from ${client.ip}`);
            throw new UnauthorizedException();
        }

        await this.database.User.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });
        return {
            token: await this.auth.user.sign(user),
        };
    }

    @ApiBearerAuth()
    @Get('profile')
    @UseGuards(UserAppAuthGuard)
    async getProfile(@User() usr) {
        return this.auth.user.user(usr._id);
    }

    @ApiBearerAuth()
    @Get('logout')
    @UseGuards(UserAppAuthGuard)
    async logout(@AccessToken() token, @User() usr) {
        const user = await this.database.User.findById(usr._id);
        user.registrationTokens = null;
        await user.save();

        return { success: await this.auth.token(token).void() };
    }

    @ApiBearerAuth()
    @Put('password')
    @UseGuards(UserAppAuthGuard)
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
    @UseGuards(UserAppAuthGuard)
    async updateProfile(@User() usr, @Body() body: UpdateProfileAppDTO, @RemoteClient() client) {
        try {
            const user = await this.database.User.findOne({ _id: usr._id });
            if (!user) {
                throw new NotFoundException();
            }
            ['name', 'email', 'contact', 'current', 'password', 'registrationTokens'].forEach((k) => {
                if (body.hasOwnProperty(k)) {
                    user[k] = body[k];
                }
            });

            if (body.current && body.password) {
                const ok = await this.auth.user.attempt({
                    email: user.email,
                    password: body.current,
                });

                if (!ok) {
                    throw new ForbiddenException('Current password does not match!');
                }
                user.password = body.password;
            }

            await user.save();

            this.syslog.audit.info(`user ${user.username} updated own password from ${client.ip}`);
            return { success: true };
        } catch (err) {
            this.syslog.audit.notice(`[ERR] - ${usr.username} update profile failed`);
            console.log(err);
        }
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

        this.logger.verbose(`admin ${user.email} requested forgot password from ip ${client.ip}`);
        this.syslog.audit.notice(`admin ${user.name} requested forget password from ip ${client.ip}`, { client });

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
