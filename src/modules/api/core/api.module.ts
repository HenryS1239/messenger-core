import { Module } from '@nestjs/common';
import { AuthModule } from '@src/imports/auth';
import { DatabaseModule } from '@src/imports/database';
import { SharedModule } from '@src/imports/shared';
import { UtilModule } from '@src/imports/util';
import { LoggerModule } from '@src/imports/logger';
import { NotificationService } from '@src/imports/notifications/notification.service';

import { AuthController } from './auth.controller';
import { LogsController } from './logs.controller';
import { SettingsController } from './settings.controller';
import { UserController } from './user.controller';
import { SelectorsController } from './selectors.controller';
import { HelpersController } from './helpers.controller';
import { MessageController } from './message.controller';
import { RoleController } from './role.controller';
import { NotificationController } from './notification.controller';

@Module({
    imports: [AuthModule, DatabaseModule, SharedModule, UtilModule, LoggerModule],
    controllers: [
        AuthController,
        LogsController,
        SettingsController,

        UserController,

        SelectorsController,

        HelpersController,

        MessageController,
        RoleController,

        NotificationController,
    ],
    providers: [NotificationService],
})
export class ApiModule {}
