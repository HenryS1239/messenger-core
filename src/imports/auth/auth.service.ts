import { ForbiddenException, Injectable, Logger, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database';
import * as jwt from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { SettingService } from '@src/imports/util';
import { random } from '@src/util';
import {
    AUTH_USER_ALLOWED_MULTI_LOGIN,
    AUTH_USER_FORGET_PASSWORD_CODE_EXPIRY_MINUTES,
    AUTH_USER_REFRESH_TOKEN_EXPIRY_MINUTES,
    AUTH_USER_SECRET,
    AUTH_USER_TOKEN_EXPIRY_MINUTES,
} from '@src/config';
import * as moment from 'moment';
import { IUser } from '@src/imports/database/schema';

const getToken = (authorization) => (authorization?.startsWith('Bearer') ? authorization.substring(6).trim() : authorization);

type Credential = { email?: string; password?: string; type?: string; platform?: string };
type UserAuthContract<T> = {
    sign: (user: T) => Promise<string>;
    attempt: (credential: Credential) => Promise<T>;
    validate: (authorization: string) => Promise<any>;
    forgetPassword: {
        generate: (userId: string) => Promise<string>;
        validate: (userId: string, code: string) => Promise<boolean>;
    };
    user: (id: string) => Promise<IUser & any>;
};

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    //--
    constructor(private readonly database: DatabaseService, private readonly settings: SettingService) {}

    public get config() {
        const toBoolean = (v: any) => ['true', '1'].includes(`${v}`.toLowerCase());
        return {
            user: {
                secret: AUTH_USER_SECRET,
                token_expiry_m: AUTH_USER_TOKEN_EXPIRY_MINUTES,
                refresh_token_expiry_m: AUTH_USER_REFRESH_TOKEN_EXPIRY_MINUTES,
                is_allowed_multi_login: toBoolean(AUTH_USER_ALLOWED_MULTI_LOGIN),
                forget_password_expiry_m: AUTH_USER_FORGET_PASSWORD_CODE_EXPIRY_MINUTES ?? 10,
            },
        };
    }

    public get user(): UserAuthContract<IUser> {
        return {
            user: async (id: string) => {
                const user = await this.database.User.findOne({ _id: id });
                return {
                    _id: user._id,
                    type: user.type,
                    username: user.username,
                    name: user.name,
                    role: user.role,
                    email: user.email,
                    contact: user.contact,
                };
            },
            sign: async (user: any) => {
                const { secret, token_expiry_m } = this.config.user;
                return jwt.sign(
                    {
                        sub: user._id,
                        _id: user._id,
                        type: user.type,
                        username: user.username,
                        name: user.name,
                        role: user.role,
                        email: user.email,
                        contact: user.contact,
                    },
                    secret,
                    { expiresIn: `${token_expiry_m}m` },
                );
            },
            attempt: async (credential: Credential) => {
                const user = await this.database.User.findOne({
                    email: credential.email,
                    deletedAt: { $eq: null },
                }).select('+password +createdAt +updatedAt');

                if (user && (await bcrypt.compare(credential.password, user.password))) {
                    if (user.isDisabled) {
                        throw new ForbiddenException(`user already disabled by system admin.`);
                    }

                    user.lastLogin = new Date();
                    await user.save();
                    return user;
                }
                throw new UnauthorizedException(`Incorrect credentials. Please try again.`);
            },
            validate: async (authorization: string) => {
                const token = getToken(authorization);
                if (!token) {
                    throw new UnauthorizedException();
                }
                const { secret } = this.config.user;
                try {
                    return jwt.verify(token, secret, {
                        ignoreExpiration: false,
                    }) as any;
                } catch (err) {
                    if (err instanceof TokenExpiredError) {
                        throw new UnauthorizedException({
                            statusCode: 401,
                            message: err.message,
                        });
                    }
                    throw err;
                }
            },
            forgetPassword: {
                generate: async (userId: string) => {
                    const user = await this.database.User.findOne({
                        _id: userId,
                    });
                    if (!user) {
                        throw new NotFoundException();
                    }

                    const { forget_password_expiry_m } = this.config.user;

                    const secret = random.alhanumeric(6);
                    const expiryMinutes = forget_password_expiry_m;
                    const expiry = moment().add(expiryMinutes, 'minutes');

                    user.forgetPasswordPasscode = bcrypt.hashSync(secret, 10);
                    user.forgetPasswordExpiry = expiry.toDate();

                    await user.save();

                    this.logger.debug(`generated forget password for user ${user.username}`);

                    const [email, domain] = user.email.split('@');
                    const converted = [
                        email
                            .split('')
                            .map((v, index) => (index === 0 || index >= email.length - 3 ? v : '*'))
                            .join(''),
                        domain
                            .split('')
                            .map((v, index) => (index <= 3 ? v : '*'))
                            .join(''),
                    ];

                    return converted.join('@');
                },
                validate: async (userId: string, passcode: string) => {
                    const user = await this.database.User.findOne({
                        _id: userId,
                    })
                        .select('+forgetPasswordExpiry')
                        .select('+forgetPasswordPasscode');

                    if (user) {
                        if (user.forgetPasswordPasscode && bcrypt.compareSync(passcode, user.forgetPasswordPasscode)) {
                            if (moment().isAfter(moment(user.forgetPasswordExpiry))) {
                                throw new NotAcceptableException(`Verification code expired. Please send another request.`);
                            }
                            return true;
                        }
                        throw new NotAcceptableException(`invalid verification code.`);
                    }
                    throw new NotAcceptableException(`user not found`);
                },
            },
        };
    }

    // --
    public token(authorization: string) {
        const token = getToken(authorization);
        if (!token) {
            throw new UnauthorizedException();
        }
        return {
            void: async () => {
                if (
                    (await this.database.BannedToken.findOne({
                        token,
                    }).countDocuments()) > 0
                ) {
                    return false;
                }
                await this.database.BannedToken.create({ token });
                return true;
            },
            banned: async () => {
                return (
                    (await this.database.BannedToken.findOne({
                        token,
                    }).countDocuments()) > 0
                );
            },
        };
    }
}
