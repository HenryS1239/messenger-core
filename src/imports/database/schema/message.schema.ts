import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserRecordTemplate } from './template';
import { IUser } from './user.schema';

const schema = new mongoose.Schema(
    {
        subject: {
            type: Schema.Types.String,
            default: null,
        },
        content: {
            type: Schema.Types.String,
            default: null,
        },
        receipient: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                default: null,
            },
        ],
        readBy: [
            {
                name: {
                    type: Schema.Types.String,
                    default: null,
                },
                readAt: {
                    type: Schema.Types.Date,
                    default: null,
                },
                userRefId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    default: null,
                },
            },
        ],
        ...UserRecordTemplate.STANDARD_UR,
    },
    {
        timestamps: true,
    },
);

schema.index({
    subject: 'text',
    content: 'text',
    receipient: 'text',
    'readBy.name': 'text',
    'readBy.readAt': 'text',
    'readBy.userRefId': 'text',
});

interface IReadBy {
    name: string;
    readAt: Date;
    userRefId: string | IUser;
}

export interface IMessage {
    subject: string;
    content: string;
    receipient: string[] | IUser[];
    readBy: IReadBy[];
    createdBy: any;
    updatedBy: any;
    deletedBy: any;
    createdAt: Date;
    updatedat: Date;
    deletedAt: Date;
}

export const MessageSchema = schema;
