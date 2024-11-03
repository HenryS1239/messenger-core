import { Controller, Get, Logger } from '@nestjs/common';

import { DatabaseService } from '@src/imports/database';
import { SyslogService } from '@src/imports/logger';
import {} from '@src/imports/shared';
import { NotificationService } from '@src/imports/notifications/notification.service';

@Controller('/api/customer/helpers')
export class HelpersController {
    private readonly logger = new Logger(HelpersController.name);

    constructor(
        private readonly database: DatabaseService,
        private readonly syslog: SyslogService,
        private readonly notification: NotificationService,
    ) {}

    @Get('send/notification/app')
    async sendNotificationApp() {
        const user = await this.database.User.findById('631064cbda3876fe146b1990').select('+registrationTokens');

        return await this.notification.send.app({
            event: `completed`,
            user,
            data: {},
        });
    }
    @Get('send/notification/web')
    async sendNotificationWeb() {
        const user = await this.database.User.findById('631064cbda3876fe146b1990').select('+registrationTokens');

        return await this.notification.send.web({
            event: `completed`,
            user,
            data: {},
        });
    }
}
