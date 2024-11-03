import { Controller, Get, Logger } from '@nestjs/common';

import { DatabaseService } from '@src/imports/database';
import {} from '@src/imports/shared';
import { NotificationService } from '@src/imports/notifications/notification.service';

@Controller('/api/customer/helpers')
export class HelpersController {
    private readonly logger = new Logger(HelpersController.name);

    constructor(private readonly database: DatabaseService, private readonly notification: NotificationService) {}
}
