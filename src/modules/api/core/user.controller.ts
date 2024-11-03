import {
    Controller,
    Get,
    Query,
    Body,
    Post,
    Put,
    Param,
    Delete,
    InternalServerErrorException,
    NotAcceptableException,
    NotFoundException,
    UseGuards,
    Req,
} from '@nestjs/common';
import { random } from '@src/util';
import { DatabaseService } from '@src/imports/database';
import { SyslogService } from '@src/imports/logger';
import { User } from '@src/decorations';
import { UserCreateDTO, UserStatusDTO, UserUpdateDTO } from './dto/user.dto';
import { AdminAuthGuard } from '@src/imports/auth';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { USER_ROLE_TYPES, USER_TYPES } from '@src/constants';
import { Logger } from '@nestjs/common';

@ApiTags('Core:User')
@Controller('api/core/user')
@ApiBearerAuth()
export class UserController {
    constructor(private readonly database: DatabaseService, private readonly syslog: SyslogService) {}
    logger = new Logger('Email');

    @ApiQuery({ name: 'offset', type: Number, required: true })
    @ApiQuery({ name: 'limit', type: Number, required: true })
    @ApiQuery({ name: 'search', type: String, required: false })
    @ApiQuery({ name: 'types', type: String, required: false })
    @Get('')
    @UseGuards(AdminAuthGuard)
    async list(@Query() { limit, offset, search, types }) {
        try {
            const query: any = { deletedAt: null };
            if (search) {
                query['$or'] = [
                    { name: { $regex: new RegExp(search, 'i') } },
                    { email: { $regex: new RegExp(search, 'i') } },
                    { username: { $regex: new RegExp(search, 'i') } },
                ];
            }
            if (types) {
                query.type = { $in: types.split(',') };
            }

            const total = await this.database.User.countDocuments(query);
            const items = await this.database.User.find(query).skip(parseInt(offset)).limit(parseInt(limit)).populate('role');

            return { total, items };
        } catch (err) {
            this.syslog.system.error(`[GET] /core/user: ${err.message}`);
            throw new InternalServerErrorException(err.message);
        }
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    @UseGuards(AdminAuthGuard)
    async get(@Param('id') _id) {
        try {
            const rs = await this.database.User.findOne({ _id, deletedAt: { $eq: null } });
            if (!rs) {
                throw new NotFoundException();
            }
            return rs;
        } catch (err) {
            this.syslog.system.error(`[GET] /core/user/${_id}: ${err.message}`);
            throw new InternalServerErrorException(err.message);
        }
    }

    @Post('')
    @UseGuards(AdminAuthGuard)
    async create(@Body() body: UserCreateDTO, @User() user) {
        try {
            const count = await this.database.User.countDocuments({ email: body.email, deletedAt: { $eq: null } });

            if (count > 0) {
                throw new NotAcceptableException('An account is already registered with your email. Please try again.');
            }

            const adminRole = await this.database.Role.findOne({ type: USER_ROLE_TYPES.ADMIN });

            if (body.type === USER_TYPES.ADMIN && body.role === adminRole._id.toString() && !body.password) {
                throw new NotAcceptableException('Please include a password with the registration.');
            }

            const newUser = this.setUser(await new this.database.User(), body);

            newUser.isDisabled = false;
            newUser.createdBy = {
                name: user?.name,
                userId: user?._id,
                type: user?.type,
            };

            let newPassword = null;

            if (body.type === USER_TYPES.ADMIN && body.role === adminRole._id.toString() && body.password) {
                newPassword = body.password;
            } else {
                newPassword = random.alhanumeric(6);
            }

            newUser.password = newPassword;

            await newUser.save();

            return newUser;
        } catch (err) {
            this.syslog.system.error(`[POST] /core/user: ${err.message}`);
            throw new InternalServerErrorException(err.message);
        }
    }

    @Put(':id')
    @ApiParam({ name: 'id' })
    @UseGuards(AdminAuthGuard)
    async update(@Param('id') _id, @Body() body: UserUpdateDTO, @Req() { user }) {
        try {
            const rs = await this.database.User.findOne({ _id });

            if (!rs) {
                throw new NotFoundException();
            }

            const count = await this.database.User.countDocuments({ email: body.email, deletedAt: { $eq: null }, _id: { $ne: _id } });

            if (count > 0) {
                throw new NotAcceptableException('This email has been registered by another account. Please try again.');
            }

            const newUser = this.setUser(rs, body);
            newUser.updatedAt = Date();
            newUser.updatedBy = {
                name: user?.name,
                userId: user?._id,
                type: user?.type,
            };

            return await newUser.save();
        } catch (err) {
            this.syslog.system.error(`[PUT] /core/user/${_id}: ${err.message}`);
            throw new InternalServerErrorException(err.message);
        }
    }

    @Put('/status/:id')
    @ApiParam({ name: 'id' })
    @UseGuards(AdminAuthGuard)
    async updateStatus(@Param('id') _id, @Body() body: UserStatusDTO, @User() user) {
        try {
            const rs = await this.database.User.findOne({ _id });
            if (!rs) {
                throw new NotFoundException();
            }

            rs.isDisabled = body.isDisabled;
            rs.updatedBy = {
                name: user?.name,
                userId: user?._id,
                type: user?.type,
            };
            rs.updatedAt = new Date();
            await rs.save();
            return rs;
        } catch (err) {
            this.syslog.system.error(`[PUT] /core/user/status/${_id} : ${err.message}`);
            throw new InternalServerErrorException(err);
        }
    }

    @Delete(':id')
    @ApiParam({ name: 'id' })
    @UseGuards(AdminAuthGuard)
    async delete(@Param('id') _id, @User() user) {
        try {
            const rs = await this.database.User.findOne({ _id });

            if (!rs) {
                throw new NotFoundException();
            }
            rs.deletedBy = {
                name: user?.name,
                userId: user?._id,
                type: user?.type,
            };
            rs.deletedAt = new Date();
            await rs.save();

            return rs;
        } catch (err) {
            this.syslog.system.error(`[DELETE] /core/user/${_id} : ${err.message}`);
            throw new InternalServerErrorException(err);
        }
    }

    private setUser(rs: any, body: any) {
        for (const k of ['type', 'role', 'name', 'username', 'password', 'contact', 'email', 'isDisabled']) {
            if (body.hasOwnProperty(k)) {
                rs[k] = body[k];
            }
        }
        return rs;
    }
}
