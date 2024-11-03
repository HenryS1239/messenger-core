import { Controller, UseGuards, Param, Query, Get, InternalServerErrorException } from '@nestjs/common';
import { UserAppAuthGuard } from '@src/imports/auth';
import { DatabaseService } from '@src/imports/database';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SyslogService } from '@src/imports/logger';
import { User } from '@src/decorations';

@ApiTags('Customer:Message')
@ApiBearerAuth()
@Controller('/api/customer/message')
@ApiBearerAuth()
export class MessageController {
    constructor(public readonly database: DatabaseService, private readonly syslog: SyslogService) {}

    @Get('')
    @ApiQuery({ name: 'offset', type: Number, required: true })
    @ApiQuery({ name: 'limit', type: Number, required: true })
    @ApiQuery({ name: 'customer', type: String, required: false })
    @UseGuards(UserAppAuthGuard)
    async list(@Query() q) {
        try {
            const { limit, offset, customer } = q;

            const query: any = { deletedAt: null };

            if (customer) {
                query.receipient = { $in: [customer] };
            }

            const total = await this.database.Message.countDocuments(query);
            const items = await this.database.Message.find(query).populate('receipient').skip(parseInt(offset)).limit(parseInt(limit));

            return { total, items };
        } catch (error) {
            this.syslog.audit.error(`[GET] /customer/message/ - ${error.message}`);
            throw new InternalServerErrorException(error.message);
        }
    }

    @Get('/:id')
    @UseGuards(UserAppAuthGuard)
    async get(@Param('id') _id, @User() user) {
        try {
            const message = await this.database.Message.findOne({ _id, deletedAt: null }).lean();
            const messageReadByUser = message.readBy.find((item) => item.userRefId == user._id);
            if (!messageReadByUser) {
                await this.database.Message.updateOne(
                    {
                        _id,
                        deletedAt: null,
                    },
                    {
                        $set: {
                            readBy: [
                                ...message.readBy,
                                {
                                    name: user?.name,
                                    readAt: new Date(),
                                    userRefId: user?._id,
                                },
                            ],
                        },
                    },
                );
                return await this.database.Message.findOne({ _id, deletedAt: null }).lean();
            } else {
                return message;
            }
        } catch (error) {
            this.syslog.audit.error(`[GET] /customer/message/${_id} - ${error.message}`);
            throw new InternalServerErrorException(error.message);
        }
    }
}
