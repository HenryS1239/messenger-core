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
} from '@nestjs/common';
import { DatabaseService } from '@src/imports/database';
import { SyslogService } from '@src/imports/logger';
import { User } from '@src/decorations';
import { RoleInputDTO } from './dto/role.dto';
import { AdminAuthGuard } from '@src/imports/auth';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Core:Role')
@Controller('api/core/roles')
@ApiBearerAuth()
export class RoleController {
    constructor(private readonly database: DatabaseService, private readonly syslog: SyslogService) {}

    @ApiQuery({ name: 'offset', type: Number, required: true })
    @ApiQuery({ name: 'limit', type: Number, required: true })
    @ApiQuery({ name: 'search', type: String, required: false })
    @ApiQuery({ name: 'type', type: Array, required: false })
    @Get('')
    @UseGuards(AdminAuthGuard)
    async list(@Query() { limit, offset, search, type }) {
        try {
            const query: any = { deletedAt: { $eq: null } };

            if (search) {
                query['$or'] = [{ name: { $regex: new RegExp(search, 'i') } }];
            }

            if (type) {
                query.type = { $in: type.split(',') };
            }

            const total = await this.database.Role.countDocuments(query);
            const items = await this.database.Role.find(query).skip(parseInt(offset)).limit(parseInt(limit));

            return { total, items };
        } catch (error) {
            this.syslog.system.error(`[GET] /core/roles - ${error.message}`);
            throw new InternalServerErrorException(error.message);
        }
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    @UseGuards(AdminAuthGuard)
    async get(@Param('id') _id) {
        try {
            const rs = await this.database.Role.findOne({ _id });

            if (!rs) {
                throw new NotFoundException();
            }
            return rs;
        } catch (error) {
            this.syslog.system.error(`[GET] /core/roles/:id - ${error.message}`);
            throw new InternalServerErrorException(error.message);
        }
    }

    @Post('')
    @UseGuards(AdminAuthGuard)
    async create(@Body() body: RoleInputDTO, @User() user) {
        try {
            if (await this.database.Role.findOne({ type: body.type, deletedAt: { $eq: null } })) {
                throw new NotAcceptableException('The role type already exists! Please modify or delete the existing record');
            }
            const rs = this.setRole(await new this.database.Role(), body);
            rs.createdBy = {
                name: user?.name,
                userId: user?._id,
                type: user?.type,
            };

            await rs.save();
            return rs;
        } catch (err) {
            this.syslog.system.error(`[POST] /core/roles: ${err.message}`);
            throw new InternalServerErrorException(err.message);
        }
    }

    @Put(':id')
    @ApiParam({ name: 'id' })
    @UseGuards(AdminAuthGuard)
    async update(@Param('id') _id, @Body() body: RoleInputDTO, @User() user) {
        try {
            const rs = await this.database.Role.findOne({ _id });

            if (!rs) {
                throw new NotFoundException();
            }

            if (rs && rs.type !== body.type && (await this.database.Role.findOne({ type: body.type, deletedAt: { $eq: null } }))) {
                throw new NotAcceptableException('The role type already exists!');
            }

            const role = Object.assign(rs, body);

            role.updatedAt = Date();
            role.updatedBy = {
                name: user?.name,
                userId: user?._id,
                type: user?.type,
            };
            await role.save();
            return role;
        } catch (err) {
            this.syslog.system.error(`[PUT] /core/roles/:id ${err.message}`);
            throw new InternalServerErrorException(err.message);
        }
    }

    @Delete(':id')
    @ApiParam({ name: 'id' })
    @UseGuards(AdminAuthGuard)
    async delete(@Param('id') _id, @User() user) {
        try {
            const rs = await this.database.Role.findOne({ _id });

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
            this.syslog.system.error(`[DELETE] /core/roles/:id : ${err.message}`);
            throw new InternalServerErrorException(err);
        }
    }

    private setRole(rs: any, body: any) {
        for (const k of ['name', 'type']) {
            if (body.hasOwnProperty(k)) {
                rs[k] = body[k];
            }
        }
        return rs;
    }
}
