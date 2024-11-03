import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseModule } from '@src/imports/database';
import { UtilModule } from '@src/imports/util';
import { SharedModule } from '../shared';

@Module({
    imports: [DatabaseModule, SharedModule, UtilModule],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
