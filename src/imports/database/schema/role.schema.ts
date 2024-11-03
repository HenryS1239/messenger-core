import { USER_ROLE_TYPES } from '@src/constants';
import { Schema, Document } from 'mongoose';
import { UserRecordTemplate } from './template';

const schema = new Schema(
    {
        name: {
            type: Schema.Types.String,
            default: null,
            required: true,
        },
        type: { type: Schema.Types.String, enum: Object.values(USER_ROLE_TYPES), required: true },
        canDelete: { type: Schema.Types.Boolean, default: true },
        ...UserRecordTemplate.STANDARD_UR,
    },
    {
        timestamps: true,
        toObject: { versionKey: false },
        toJSON: { versionKey: false },
    },
);

export const RoleSchema = schema;

export interface IUserRecord {
    userId: string;
    name: string;
    type: string;
}

export interface IRole extends Document {
    name: string;
    type: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    createdBy?: IUserRecord;
    updatedBy?: IUserRecord;
    deletedBy?: IUserRecord;
}
