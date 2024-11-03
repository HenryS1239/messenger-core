import {
    Body,
    Controller,
    Post,
    UseGuards,
    Param,
    Query,
    Get,
    Delete,
    NotFoundException,
    InternalServerErrorException,
    Req,
    Logger,
} from '@nestjs/common';
import { AdminAuthGuard } from '@src/imports/auth';
import { DatabaseService } from '@src/imports/database';
import { CreateMessageDTO } from './dto/message.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SyslogService } from '@src/imports/logger';
import { NotificationService } from '@src/imports/notifications/notification.service';

@ApiTags('Core:Message')
@ApiBearerAuth()
@Controller('/api/core/message')
@ApiBearerAuth()
export class MessageController {
    private readonly logger = new Logger(MessageController.name);

    constructor(
        public readonly database: DatabaseService,
        private readonly notification: NotificationService,
        private readonly syslog: SyslogService,
    ) {}

    @Get('')
    @ApiQuery({ name: 'offset', type: Number, required: true })
    @ApiQuery({ name: 'limit', type: Number, required: true })
    @ApiQuery({ name: 'user', type: String, required: false })
    @UseGuards(AdminAuthGuard)
    async list(@Query() q) {
        try {
            const { limit, offset, user } = q;

            const query: any = { deletedAt: null };

            if (user) {
                query.receipient = { $in: [user] };
            }

            const total = await this.database.Message.countDocuments(query);
            const items = await this.database.Message.find(query).populate('receipient').skip(parseInt(offset)).limit(parseInt(limit));

            return { total, items };
        } catch (error) {
            this.syslog.audit.error(`[GET] /core/message/ - ${error.message}`);
            throw new InternalServerErrorException(error.message);
        }
    }

    @Get('/:id')
    @UseGuards(AdminAuthGuard)
    async get(@Param('id') _id) {
        try {
            const message = await this.database.Message.findOne({ _id, deletedAt: null });
            return message;
        } catch (error) {
            this.syslog.audit.error(`[GET] /core/message/${_id} - ${error.message}`);
            throw new InternalServerErrorException(error.message);
        }
    }

    @Post('')
    @UseGuards(AdminAuthGuard)
    async broadcastMessage(@Body() body: CreateMessageDTO, @Req() { user }) {
        try {
            const rs = new this.database.Message(body);
            rs.createdBy = user;
            await rs.save();

            const currentUser = await this.database.User.find({
                _id: { $in: body.receipient },
                deletedAt: null,
            }).select('+registrationTokens');

            //for each receipient selected, send browser notification
            for (const eachUser of currentUser) {
                await this.notification.send.app({
                    event: {
                        title: body.subject,
                        message: body.content,
                    },
                    user: eachUser,
                });
            }

            return { success: true, data: rs };
        } catch (error) {
            this.logger.debug(error);
            this.syslog.audit.error(`[POST] /core/message/ - ${error.message}`);
            throw new InternalServerErrorException(error.message);
        }
    }

    @Delete('/:id')
    @UseGuards(AdminAuthGuard)
    async delete(@Param('id') _id, @Req() { user }) {
        try {
            const message = await this.database.Message.findOne({ _id });
            if (!message) {
                throw new NotFoundException();
            }
            message.deletedAt = new Date();
            message.deletedBy = {
                name: user.name,
                userId: user._id,
                type: user.type,
            };
            await message.save();
        } catch (error) {
            this.syslog.audit.error(`[DELETE] /core/message/${_id} - ${error.message}`);
            throw new InternalServerErrorException(error.message);
        }
    }
}
