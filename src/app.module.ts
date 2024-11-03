import { Module } from '@nestjs/common';

import { MongooseModule } from '@src/imports/database';

import { CustomerApiModule, CoreApiModule } from '@src/modules/api';
import { WorkerModule } from '@src/modules/worker';

@Module({
    imports: [MongooseModule, CoreApiModule, CustomerApiModule, WorkerModule],
})
export class AppModule {}
