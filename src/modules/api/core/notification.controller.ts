import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '@src/imports/auth';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SyslogService } from '@src/imports/logger';
import { User } from '@src/decorations';
import { PLATFORM } from '@src/constants';
import { NotificationService } from '@src/imports/notifications/notification.service';

@ApiTags('Core: Notifications')
@ApiBearerAuth()
@Controller('/api/core/notifications')
export class NotificationController {
    constructor(private readonly notification: NotificationService, private readonly syslog: SyslogService) {}

    @Get('')
    @ApiQuery({ name: 'offset', type: Number, required: true })
    @ApiQuery({ name: 'limit', type: Number, required: true })
    @UseGuards(AdminAuthGuard)
    async list(@Query() { offset, limit }, @User() user) {
        try {
            return await this.notification.get.list({
                offset,
                limit,
                user,
            });
        } catch (err) {
            this.syslog.audit.error(`[GET] /core/notifications - ${err.message}`);
            throw new BadRequestException(err.message);
        }
    }

    @Get('/browser/alert')
    @ApiQuery({ name: 'offset', type: Number, required: true })
    @ApiQuery({ name: 'limit', type: Number, required: true })
    @UseGuards(AdminAuthGuard)
    async browserAlert(@User() user) {
        try {
            return await this.notification.get.browserAlert({
                source: PLATFORM.WEB,
                user,
            });
        } catch (err) {
            this.syslog.audit.error(`[GET] /core/notifications/browser/alert - ${err.message}`);
            throw new BadRequestException(err.message);
        }
    }

    @Post('read')
    @UseGuards(AdminAuthGuard)
    async set(@Body() body, @User() user) {
        try {
            return await this.notification.read({
                source: PLATFORM.WEB,
                ids: body.ids,
                user,
            });
        } catch (err) {
            this.syslog.audit.error(`[POST] /core/notifications/read - ${err.message}`);
            throw new BadRequestException(err.message);
        }
    }
}
