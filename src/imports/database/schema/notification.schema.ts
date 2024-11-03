import { Document, Schema } from 'mongoose';
import { UserRecordTemplate } from './template';

export const NotificationSchema = new Schema(
    {
        target: { type: Schema.Types.String, default: null },
        targetId: { type: Schema.Types.String, default: null },

        appNotifiedAt: { type: Schema.Types.Date, default: null },

        message: { type: Schema.Types.String, default: null },
        title: { type: Schema.Types.String, default: null },

        user: { type: Schema.Types.ObjectId, ref: 'User', default: null },

        isRead: { type: Schema.Types.Boolean, default: false },

        appReadAt: { type: Schema.Types.Date, default: null },
        appReadBy: {
            userId: {
                type: Schema.Types.String,
                default: null,
            },
            name: {
                type: Schema.Types.String,
                default: null,
            },
            type: {
                type: Schema.Types.String,
                default: null,
            },
        },
        webReadAt: { type: Schema.Types.Date, default: null },
        webReadBy: {
            userId: {
                type: Schema.Types.String,
                default: null,
            },
            name: {
                type: Schema.Types.String,
                default: null,
            },
            type: {
                type: Schema.Types.String,
                default: null,
            },
        },

        isBrowserRequest: { type: Schema.Types.Boolean, default: false },

        ...UserRecordTemplate.STANDARD_UR,
    },
    {
        timestamps: true,
        toJSON: { versionKey: false },
    },
);

export interface INotification extends Document {
    target: string;
    targetId: string;
    appNotifiedAt: Date;

    title: Date;
    message: Date;

    user: string;

    isRead: boolean;

    appReadAt: Date;
    appReadBy: string;

    webReadAt: Date;
    webReadBy: string;

    isBrowserRequest: boolean;

    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    createdBy?: any;
    updatedBy?: any;
    deletedBy?: any;
}
