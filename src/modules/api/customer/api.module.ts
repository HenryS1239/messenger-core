import { Module } from '@nestjs/common';
import { AuthModule } from '@src/imports/auth';
import { DatabaseModule } from '@src/imports/database';
import { UtilModule } from '@src/imports/util';
import { LoggerModule } from '@src/imports/logger';
import { CounterService, SharedModule } from '@src/imports/shared';

import { AuthController } from './auth.controller';
import { SettingsController } from './settings.controller';
import { UserController } from './user.controller';
import { HelpersController } from './helpers.controller';

import { NotificationService } from '@src/imports/notifications/notification.service';

@Module({
    imports: [AuthModule, DatabaseModule, UtilModule, LoggerModule, SharedModule],
    controllers: [AuthController, SettingsController, UserController, HelpersController],
    providers: [NotificationService, CounterService],
})
export class ApiModule {}
