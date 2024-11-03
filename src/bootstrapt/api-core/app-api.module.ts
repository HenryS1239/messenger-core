import { Module } from '@nestjs/common';
import { MongooseModule } from '@src/imports/database';

import { CoreApiModule } from '@src/modules/api';
import { LoggerModule } from '@src/imports/logger';

@Module({
    imports: [
        MongooseModule,
        LoggerModule,
        CoreApiModule,
    ],
})
export class AppApiModule {
}
