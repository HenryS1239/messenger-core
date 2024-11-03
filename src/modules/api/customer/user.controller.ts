import { Controller, Get, Query, Param, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { DatabaseService } from '@src/imports/database';
import { SyslogService } from '@src/imports/logger';
import { UserAppAuthGuard } from '@src/imports/auth';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Customer:User')
@Controller('api/customer/user')
@ApiBearerAuth()
export class UserController {
    constructor(private readonly database: DatabaseService, private readonly syslog: SyslogService) {}

    @ApiQuery({ name: 'offset', type: Number, required: true })
    @ApiQuery({ name: 'limit', type: Number, required: true })
    @ApiQuery({ name: 'search', type: String, required: false })
    @ApiQuery({
        name: 'type',
        type: String,
        required: false,
    })
    @Get('')
    @UseGuards(UserAppAuthGuard)
    async list(@Query() { limit, offset, search, type }) {
        try {
            const query: any = { deletedAt: { $eq: null } };

            if (search) {
                query['$or'] = [
                    { name: { $regex: new RegExp(search, 'i') } },
                    { email: { $regex: new RegExp(search, 'i') } },
                    { username: { $regex: new RegExp(search, 'i') } },
                ];
            }

            if (type) {
                query.type = type;
            }
            const total = await this.database.User.countDocuments(query);
            const items = await this.database.User.find(query)
                .skip(parseInt(offset))
                .limit(parseInt(limit))
                .populate('role')
                .populate('company');

            return { total, items };
        } catch (err) {
            this.syslog.system.error(`[GET] /core/user: ${err.message}`);
            throw new InternalServerErrorException(err.message);
        }
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    @UseGuards(UserAppAuthGuard)
    async get(@Param('id') _id) {
        try {
            const rs = await this.database.User.findOne({ _id, deletedAt: { $eq: null } });
            if (!rs) {
                throw new NotFoundException();
            }
            return rs;
        } catch (err) {
            this.syslog.system.error(`[GET] /core/user: ${err.message}`);
            throw new InternalServerErrorException(err.message);
        }
    }
}
