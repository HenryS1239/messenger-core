import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
    UserSchema,
    BannedTokenSchema,
    CounterSchema,
    FileSchema,
    LogSchema,
    MessageSchema,
    RoleSchema,
    NotificationSchema,
} from './schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'User', schema: UserSchema },
            { name: 'BannedToken', schema: BannedTokenSchema },
            { name: 'Counter', schema: CounterSchema },
            { name: 'File', schema: FileSchema },
            { name: 'Log', schema: LogSchema },
            { name: 'AppLog', schema: LogSchema },
            { name: 'Message', schema: MessageSchema },
            { name: 'Role', schema: RoleSchema },
            { name: 'Notification', schema: NotificationSchema },
        ]),
    ],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
