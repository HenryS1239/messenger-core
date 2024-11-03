import { Module } from '@nestjs/common';
import { AuthModule } from '@src/imports/auth';
import { DatabaseModule } from '@src/imports/database';
import { SharedModule } from '@src/imports/shared';
import { UtilModule } from '@src/imports/util';
import { LoggerModule } from '@src/imports/logger';
import { NotificationService } from '@src/imports/notifications/notification.service';

import { AuthController } from './auth.controller';
import { LogsController } from './logs.controller';
import { UserController } from './user.controller';
import { HelpersController } from './helpers.controller';
import { MessageController } from './message.controller';
import { RoleController } from './role.controller';

@Module({
    imports: [AuthModule, DatabaseModule, SharedModule, UtilModule, LoggerModule],
    controllers: [AuthController, LogsController, UserController, HelpersController, MessageController, RoleController],
    providers: [NotificationService],
})
export class ApiModule {}
