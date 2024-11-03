import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/imports/database';
import { SettingService } from './setting.service';

@Module({
    imports: [DatabaseModule],
    providers: [SettingService],
    exports: [SettingService],
})
export class UtilModule {}
