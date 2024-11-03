import { Module, OnModuleInit } from '@nestjs/common';
import { DatabaseModule } from '@src/imports/database';
import { DIR_LOGS } from '@src/config';
import { DefaultLogger } from './loggers/default.logger';
import { SyslogService } from './syslog.service';

import * as fs from 'fs';

@Module({
    imports: [DatabaseModule],
    providers: [DefaultLogger, SyslogService],
    exports: [DefaultLogger, SyslogService],
})
export class LoggerModule implements OnModuleInit {
    onModuleInit(): any {
        if (!fs.existsSync(DIR_LOGS)) {
            fs.mkdirSync(DIR_LOGS);
        }
    }
}
