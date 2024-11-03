import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { DatabaseModule, MongooseModule } from '@src/imports/database';
import { SharedModule } from '@src/imports/shared';
import { InitService } from './init.service';
import { ImportService } from './import.service';
import { BinService } from './bin.service';
import { UtilModule } from '@src/imports/util';

@Module({
    imports: [
        MongooseModule,
        DatabaseModule,
        SharedModule,
        UtilModule,
    ],
    providers: [SeederService, InitService, ImportService, BinService],
})
export class CliModule {
}
