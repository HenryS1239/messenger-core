import { Module } from '@nestjs/common';

import { MongooseModule } from '@src/imports/database';

import { WorkerModule } from '@src/modules/worker';
import { LoggerModule } from '@src/imports/logger';

@Module({
    imports: [MongooseModule, LoggerModule, WorkerModule],
})
export class AppWorkerModule {}
