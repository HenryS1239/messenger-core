import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/imports/database';

@Module({
    imports: [DatabaseModule],
    providers: [],
    exports: [],
})
export class UtilModule {}
