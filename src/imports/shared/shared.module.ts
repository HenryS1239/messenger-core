import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/imports/database';
import { UtilModule } from '@src/imports/util';
import { LoggerModule } from '@src/imports/logger';

import { CounterService } from './';

const services = [CounterService];

@Module({
    imports: [DatabaseModule, UtilModule, LoggerModule],
    providers: [...services],
    exports: [...services],
})
export class SharedModule {}
