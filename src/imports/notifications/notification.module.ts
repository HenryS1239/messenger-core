import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/imports/database';
import { SharedModule } from '../shared';

@Module({
    imports: [DatabaseModule, SharedModule],
    providers: [],
    exports: [],
})
export class NotificationModule {}
