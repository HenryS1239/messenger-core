import { USER_TYPES } from '@src/constants';
import { Document, Schema } from 'mongoose';
import { UserRecordTemplate } from './template';
import * as bcrypt from 'bcryptjs';

const schema = new Schema(
    {
        type: { type: Schema.Types.String, required: true, enum: Object.values(USER_TYPES) },
        role: { type: Schema.Types.ObjectId, ref: 'Role', default: null, required: true },

        name: { type: Schema.Types.String, required: true },
        username: { type: Schema.Types.String, required: true },
        password: { type: Schema.Types.String, required: true, select: false },

        forgetPasswordPasscode: { type: Schema.Types.String, select: false },
        forgetPasswordExpiry: { type: Schema.Types.Date, select: false },

        isDisabled: { type: Schema.Types.Boolean, default: false },

        contact: { type: Schema.Types.String, default: null },
        email: { type: Schema.Types.String, default: null, unique: true },

        lastLogin: { type: Schema.Types.Date, default: null },
        ...UserRecordTemplate.STANDARD_UR,

        registrationTokens: { type: Schema.Types.String, default: null, select: false },
        isNotification: {
            type: Schema.Types.Boolean,
            default: true,
        },
    },
    {
        toObject: { versionKey: false },
        toJSON: { virtuals: true, versionKey: false },
        timestamps: true,
    },
);

schema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            this.set('password', await bcrypt.hash(this.get('password'), 10));
        }
        return next();
    } catch (error) {
        return next(error);
    }
});

export const UserSchema = schema;

export interface IUser extends Document {
    type: string;
    role: any;

    name: string;
    username: string;
    password: string;

    forgetPasswordPasscode?: string;
    forgetPasswordExpiry?: Date;

    contact: string;
    email: string;

    isDisabled: boolean;

    lastLogin: Date;

    createdBy: any;
    updatedBy: any;
    deletedBy: any;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;

    registrationTokens: string;
    isNotification: boolean;
}
