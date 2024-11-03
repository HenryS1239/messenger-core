import { Schema } from 'mongoose';

const ActionUserSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
});

export const UserRecordTemplate = {
    STANDARD_UR: {
        createdBy: { type: ActionUserSchema, select: false },
        updatedBy: { type: ActionUserSchema, select: false },
        deletedBy: { type: ActionUserSchema, select: false },
        deletedAt: { type: Schema.Types.Date, default: null, select: false },
    },
    NO_DELETED_UR: {
        createdBy: { type: ActionUserSchema, select: false },
        updatedBy: { type: ActionUserSchema, select: false },
    },
    APPROVAL_UR: {
        createdBy: { type: ActionUserSchema, select: false },
        updatedBy: { type: ActionUserSchema, select: false },
        verifyBy: { type: ActionUserSchema, select: false },
    },
    ONLY_DELETE_UR: {
        deletedBy: { type: ActionUserSchema, select: false },
        deletedAt: { type: Schema.Types.Date, default: null, select: false },
    },
};
