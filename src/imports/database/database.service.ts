import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ICounter, IFile, IMessage, IUser, INotification } from './schema';

@Injectable()
export class DatabaseService {
    public constructor(
        @InjectModel('User') public readonly User: Model<IUser>,
        @InjectModel('BannedToken') public readonly BannedToken: Model<any>,
        @InjectModel('Counter') public readonly Counter: Model<ICounter>,
        @InjectModel('File') public readonly File: Model<IFile>,
        @InjectModel('Log') public readonly Log: Model<any>,
        @InjectModel('Message') public readonly Message: Model<IMessage>,
        @InjectModel('Role') public readonly Role: Model<any>,
        @InjectModel('Notification') public readonly Notification: Model<INotification>,
    ) {}
}
