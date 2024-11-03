import { Module } from '@nestjs/common';

import { MongooseModule } from '@src/imports/database';

import { CustomerApiModule, CoreApiModule, CommonAuthApiModule } from '@src/modules/api';
import { WorkerModule } from '@src/modules/worker';

@Module({
    imports: [MongooseModule, CoreApiModule, CustomerApiModule, CommonAuthApiModule, WorkerModule],
})
export class AppModule {}
