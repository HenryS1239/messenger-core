import { Controller, Get, Query, Post, Body, Logger } from '@nestjs/common';

import { DatabaseService } from '@src/imports/database';

import * as moment from 'moment';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationService } from '@src/imports/notifications/notification.service';
import { USER_TYPES } from '@src/constants';

@ApiTags('Core:Helpers')
@ApiBearerAuth()
@Controller('/api/core/helpers')
export class HelpersController {
    private readonly logger = new Logger(HelpersController.name);

    constructor(private readonly database: DatabaseService, private readonly notification: NotificationService) {}
}
