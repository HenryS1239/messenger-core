import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '@src/imports/database';
import { UtilModule } from '@src/imports/util';

import { GcProcess } from './gc.process';
import { NotificationService } from '@src/imports/notifications/notification.service';

@Module({
    imports: [ScheduleModule.forRoot(), DatabaseModule, UtilModule],
    providers: [GcProcess, NotificationService],
})
export class ProcessModule implements OnModuleInit {
    private readonly logger = new Logger(ProcessModule.name);

    async onModuleInit() {
        this.logger.verbose(`started processing worker`);
    }
}
